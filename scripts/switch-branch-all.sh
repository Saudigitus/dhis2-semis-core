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

echo "Validating ${#submodule_paths[@]} submodules..."

# Validate every repository before switching any of them. A target may be an
# existing local branch or a branch already known through the origin remote.
for path in "${submodule_paths[@]}"; do
    if ! git -C "$path" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "Submodule is not initialized: $path" >&2
        echo "Run: git submodule update --init --recursive" >&2
        exit 1
    fi

    if [[ -n "$(git -C "$path" status --porcelain)" ]]; then
        echo "Submodule has local changes: $path" >&2
        echo "Commit, stash, or discard the changes before continuing." >&2
        exit 1
    fi

    if ! git -C "$path" rev-parse --verify HEAD >/dev/null 2>&1; then
        echo "Submodule does not have a valid current commit: $path" >&2
        exit 1
    fi

    git_dir="$(git -C "$path" rev-parse --git-dir)"
    if [[ ! -w "$git_dir" ]]; then
        echo "No permission to switch branches in: $path" >&2
        exit 1
    fi

    for operation in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
        if [[ -e "$(git -C "$path" rev-parse --git-path "$operation")" ]]; then
            echo "A Git operation is in progress in: $path ($operation)" >&2
            exit 1
        fi
    done

    if ! git -C "$path" show-ref --verify --quiet "refs/heads/$branch_name" &&
       ! git -C "$path" show-ref --verify --quiet "refs/remotes/origin/$branch_name"; then
        echo "Branch '$branch_name' was not found locally or in the known origin refs of: $path" >&2
        echo "Run 'git submodule foreach git fetch origin' if the remote branch was created recently." >&2
        exit 1
    fi
done

echo "Switching all submodules to '$branch_name'..."

switched_paths=()
original_commits=()
original_branches=()
created_local_branches=()

rollback() {
    trap - ERR
    set +e
    echo "Unexpected failure. Restoring the submodules already switched..." >&2

    for ((index=${#switched_paths[@]} - 1; index >= 0; index--)); do
        path="${switched_paths[$index]}"
        if [[ -n "${original_branches[$index]}" ]]; then
            git -C "$path" switch "${original_branches[$index]}" >/dev/null 2>&1
        else
            git -C "$path" switch --detach "${original_commits[$index]}" >/dev/null 2>&1
        fi
        if [[ "${created_local_branches[$index]}" == "1" ]]; then
            git -C "$path" branch --delete --force "$branch_name" >/dev/null 2>&1
        fi
        echo "Restored: $path" >&2
    done

    exit 1
}

trap rollback ERR

for path in "${submodule_paths[@]}"; do
    original_commit="$(git -C "$path" rev-parse HEAD)"
    original_branch="$(git -C "$path" symbolic-ref --quiet --short HEAD || true)"

    if git -C "$path" show-ref --verify --quiet "refs/heads/$branch_name"; then
        created_local_branch="0"
        git -C "$path" switch "$branch_name"
    else
        created_local_branch="1"
        git -C "$path" switch --track "origin/$branch_name"
    fi

    switched_paths+=("$path")
    original_commits+=("$original_commit")
    original_branches+=("$original_branch")
    created_local_branches+=("$created_local_branch")
    echo "Switched: $path"
done

trap - ERR
echo "Done: all submodules are now on branch '$branch_name'."
