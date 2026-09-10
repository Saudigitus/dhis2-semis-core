#!/usr/bin/env bash

set -Eeuo pipefail

branch_name="${1:-}"

if [[ -z "$branch_name" ]]; then
    echo "Usage: $0 <branch-name>" >&2
    exit 1
fi

if ! git check-ref-format --branch "$branch_name" >/dev/null 2>&1; then
    echo "Invalid branch name: $branch_name" >&2
    exit 1
fi

mapfile -t submodule_paths < <(
    git config --file .gitmodules --get-regexp '^submodule\..*\.path$' |
        awk '{ print $2 }'
)

if (( ${#submodule_paths[@]} == 0 )); then
    echo "No submodules were found in .gitmodules." >&2
    exit 1
fi

# Process submodules first and the core repository last. If any validation
# fails, no repository is changed.
repository_paths=("${submodule_paths[@]}" ".")

echo "Validating the core repository and ${#submodule_paths[@]} submodules..."

# Validate every repository before changing any of them. This avoids leaving
# only part of the project on the new branch after a predictable failure.
for path in "${repository_paths[@]}"; do
    if ! git -C "$path" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "Git repository is not available: $path" >&2
        if [[ "$path" != "." ]]; then
            echo "Run: git submodule update --init --recursive" >&2
        fi
        exit 1
    fi

    if [[ -n "$(git -C "$path" status --porcelain)" ]]; then
        echo "Repository has local changes: $path" >&2
        echo "Commit, stash, or discard the changes before continuing." >&2
        exit 1
    fi

    if ! git -C "$path" rev-parse --verify HEAD >/dev/null 2>&1; then
        echo "Repository does not have a valid initial commit: $path" >&2
        exit 1
    fi

    git_dir="$(git -C "$path" rev-parse --git-dir)"
    if [[ ! -w "$git_dir" ]]; then
        echo "No permission to create branches in: $path" >&2
        exit 1
    fi

    for operation in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
        if [[ -e "$(git -C "$path" rev-parse --git-path "$operation")" ]]; then
            echo "A Git operation is in progress in: $path ($operation)" >&2
            exit 1
        fi
    done

    new_ref="refs/heads/$branch_name"
    while IFS= read -r existing_ref; do
        if [[ "$existing_ref" == "$new_ref" ||
              "$existing_ref" == "$new_ref/"* ||
              "$new_ref" == "$existing_ref/"* ]]; then
            echo "Branch '$branch_name' conflicts with '${existing_ref#refs/heads/}' in: $path" >&2
            exit 1
        fi
    done < <(git -C "$path" for-each-ref --format='%(refname)' refs/heads)

    if ! git -C "$path" remote get-url origin >/dev/null 2>&1; then
        echo "Remote 'origin' is not configured in: $path" >&2
        exit 1
    fi

    if git -C "$path" ls-remote --exit-code --heads origin "refs/heads/$branch_name" >/dev/null 2>&1; then
        echo "Branch '$branch_name' already exists in origin for: $path" >&2
        exit 1
    else
        remote_status=$?
        if [[ $remote_status -ne 2 ]]; then
            echo "Unable to verify origin for: $path" >&2
            exit 1
        fi
    fi

    if ! git -C "$path" push --dry-run origin "HEAD:refs/heads/$branch_name" >/dev/null 2>&1; then
        echo "Push validation failed for: $path" >&2
        echo "Check your network connection and write permission on origin." >&2
        exit 1
    fi
done

echo "Creating and publishing branch '$branch_name'..."

created_paths=()
original_commits=()
original_branches=()
published_branches=()

rollback() {
    trap - ERR
    set +e
    echo "Unexpected failure. Rolling back the branches already created..." >&2

    for ((index=${#created_paths[@]} - 1; index >= 0; index--)); do
        path="${created_paths[$index]}"
        if [[ "${published_branches[$index]}" == "1" ]]; then
            if git -C "$path" push origin --delete "$branch_name" >/dev/null 2>&1; then
                echo "Removed from origin: $path" >&2
            else
                echo "Warning: could not remove '$branch_name' from origin for: $path" >&2
            fi
        fi
        if [[ -n "${original_branches[$index]}" ]]; then
            git -C "$path" switch "${original_branches[$index]}" >/dev/null 2>&1
        else
            git -C "$path" switch --detach "${original_commits[$index]}" >/dev/null 2>&1
        fi
        git -C "$path" branch --delete --force "$branch_name" >/dev/null 2>&1
        echo "Rolled back: $path" >&2
    done

    exit 1
}

trap rollback ERR

for path in "${repository_paths[@]}"; do
    original_commit="$(git -C "$path" rev-parse HEAD)"
    original_branch="$(git -C "$path" symbolic-ref --quiet --short HEAD || true)"
    git -C "$path" switch --create "$branch_name"
    created_paths+=("$path")
    original_commits+=("$original_commit")
    original_branches+=("$original_branch")
    published_branches+=("0")

    git -C "$path" push --set-upstream origin "$branch_name"
    published_branches[$((${#published_branches[@]} - 1))]="1"
    echo "Branch created and published in $path"
done

trap - ERR
echo "Done: branch '$branch_name' was created and published in the core repository and all submodules."
