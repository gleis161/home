# Gleis161 - Encrypted Content Setup

This project uses encrypted content files that are decrypted during the GitHub Actions build process.

## Local Development Setup

### Prerequisites
- Node.js 18+
- pnpm
- GPG (for encryption/decryption)

### Setup Steps

1. **Decrypt content for local development:**
   ```bash
   ./scripts/decrypt-content.sh
   ```
## Content Management

### Encrypting New Content Files

When you have new sensitive content to add:

1. **Commit only the encrypted files:**

## Project Structure

- `scripts/decrypt-content.sh` - Decrypts content files (used by GitHub Actions)
- `.github/workflows/deploy.yml` - GitHub Actions workflow for build and deployment
- `content/*.gpg` - Encrypted content files (committed to repository)
- `content/*.json`, `content/*.md` - Unencrypted files (ignored by git)
