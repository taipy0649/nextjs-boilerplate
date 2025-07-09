# See https://containers.dev/ for more information
# For Next.js, we use the node image and install dependencies
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install additional OS packages if needed
# RUN apt-get update && apt-get install -y <your-package-list>

# Set working directory
WORKDIR /workspace


# (依存関係のインストールやソースコードのコピーは不要)

# Expose Next.js default port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]
