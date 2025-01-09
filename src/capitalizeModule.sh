#!/bin/bash

# Function to capitalize the first letter of a folder
capitalize_folder_name() {
    echo "$(tr '[:lower:]' '[:upper:]' <<< "${1:0:1}")${1:1}"
}

# Iterate over all files in the directory and subdirectories
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.tsx" | while read -r file; do
    echo "Processing file: $file"
    # Process each file
    while IFS= read -r line; do
        if [[ $line =~ (@/components)((/[^/]+)+)/([a-zA-Z0-9_]+) ]]; then
            # Extract the full path, folders, and final module
            full_path="${BASH_REMATCH[0]}"
            base_path="${BASH_REMATCH[1]}"
            folders_path="${BASH_REMATCH[2]}"
            final_module="${BASH_REMATCH[4]}"

            # Remove leading slash and split folders for capitalization
            new_folders_path=$(echo "$folders_path" | tr -s '/' '\n' | while read -r folder; do
                capitalize_folder_name "$folder"
            done | tr '\n' '/' | sed 's|/$||')

            # Log changes for review
            echo "Original: $full_path"
            echo "Updated: ${base_path}${new_folders_path}/${final_module}"

            # Replace the line in the file
            # Uncomment the line below to make changes
            sed -i "s|$full_path|${base_path}${new_folders_path}/${final_module}|g" "$file"
        fi
    done < "$file"
done