#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p docs/images

# Loop through all .mmd files in docs/diagrams
for file in docs/diagrams/*.mmd; do
    # Check if file exists (in case of no matches)
    [ -e "$file" ] || continue

    # Extract filename without extension
    filename=$(basename "$file" .mmd)

    echo "Generating ${filename}.svg..."
    
    # Run mermaid-cli to generate SVG
    npx -y @mermaid-js/mermaid-cli -i "$file" -o "docs/images/${filename}.svg"
done

echo "All diagrams generated successfully."
