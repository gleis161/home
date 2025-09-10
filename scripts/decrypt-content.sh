#!/bin/bash

# set -e

PASSPHRASE=${MASTER_KEY:-""}

if [ -z "$PASSPHRASE" ]; then
    echo "Error: MASTER_KEY environment variable is not set"
    exit 1
fi

echo "Decrypting content files..."

# Decrypt all .gpg files in the content directory
for encrypted_file in content/*.gpg; do
    if [ -f "$encrypted_file" ]; then
        # Remove .gpg extension to get original filename
        original_file="${encrypted_file%.gpg}"
        echo "Decrypting $encrypted_file to $original_file..."
        
        gpg --batch --yes --passphrase "$PASSPHRASE" --decrypt "$encrypted_file" > "$original_file"
        
        if [ $? -eq 0 ]; then
            echo "Successfully decrypted $original_file"
        else
            echo "Failed to decrypt $encrypted_file"
            # exit 1
        fi
    fi
done

echo "Decryption complete!"
