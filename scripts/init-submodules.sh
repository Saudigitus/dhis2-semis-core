#!/usr/bin/env bash

set -e

echo "🚀 Adding SEMIS submodules..."

# Format: "repository|path|branch"
declare -a submodules=(
  "https://github.com/Saudigitus/dhis2-semis-attendance.git|src/modules/attendance|develop"
  "https://github.com/Saudigitus/dhis2-semis-enrollment.git|src/modules/enrollment|develop"
  "https://github.com/Saudigitus/dhis2-semis-final-result.git|src/modules/final-result|develop"
  "https://github.com/Saudigitus/dhis2-semis-performance.git|src/modules/performance|develop"
  "https://github.com/Saudigitus/dhis2-emis-school-calendar.git|src/modules/school-calendar|develop"
  "https://github.com/Saudigitus/dhis2-semis-transfer.git|src/modules/transfer|develop"
  "https://github.com/Saudigitus/dhis2-emis-config.git|src/modules/configurations|develop"
  "https://github.com/Saudigitus/dhis2-semis-transfer-execute.git|src/modules/transfer-execute|develop"
  "https://github.com/Saudigitus/dhis2-semis-components.git|src/libs/components|develop"
  "https://github.com/Saudigitus/dhis2-semis-types.git|src/libs/types|preview"
  "https://github.com/Saudigitus/dhis2-semis-customfunc.git|src/libs/functions|develop"
  "https://github.com/Saudigitus/dhis2-semis-student-profile.git|src/modules/student-profile|develop"
)

for entry in "${submodules[@]}"; do
  IFS="|" read -r repo path branch <<< "$entry"

  if [ -d "$path/.git" ]; then
    echo "✅ Submodule already exists at $path — skipping"
  else
    echo "➕ Adding submodule: $repo -> $path (branch: ${branch:-default})"

    if [ -n "$branch" ]; then
      git submodule add -b "$branch" "$repo" "$path"
    else
      git submodule add "$repo" "$path"
    fi
  fi

  echo "🙈 Configuring Git to ignore changes in submodule $path"

  # Ignore local changes
  git config submodule."$path".ignore all

  # Persist in .gitmodules (for the whole team)
  git config -f .gitmodules submodule."$path".ignore all
done

echo "📦 Initializing and updating submodules..."
git submodule update --init --recursive

echo "📌 Submodules configured to ignore all internal changes"
echo "💾 Don't forget to commit the .gitmodules file!"

echo "🎉 All submodules have been added successfully!"
