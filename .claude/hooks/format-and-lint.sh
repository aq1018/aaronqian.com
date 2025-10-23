#!/bin/bash
# Auto-format and lint-fix after file edits

FILE_PATH="$1"

# Exit if no file path provided
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Run prettier on the specific file
npx prettier --write "$FILE_PATH" 2>/dev/null

# Run eslint fix on the specific file
npx eslint --fix "$FILE_PATH" 2>/dev/null

exit 0
