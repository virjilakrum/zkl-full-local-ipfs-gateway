# ZKL IPFS Gateway & Storage System

Co-authored-by: virjilakrum <contact@zk-lokomotive.xyz>
Signed-off-by: virjilakrum <baturalp@zk-lokomotive.xyz>

Custom IPFS gateway and storage solution for the zk-lokomotive project. This implementation provides a decentralized file storage system with multiple node support and automatic replication.

## Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- IPFS Desktop (optional, for development)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/zkl-ipfs-gateway
cd zkl-ipfs-gateway
```

2. Install dependencies:
```bash
npm install
```

3. Start IPFS nodes using Docker:
```bash
docker-compose up -d
```

4. Initialize IPFS configuration:
```bash
# Configure CORS for the primary node
docker exec ipfs-node-1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs-node-1 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

# Configure CORS for the backup node
docker exec ipfs-node-2 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec ipfs-node-2 ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
```

5. Start the development server:
```bash
npm run dev
```

## Manual IPFS Node Setup (Alternative to Docker)

If you prefer running IPFS nodes manually:

1. Install IPFS:
```bash
# MacOS
brew install ipfs

# Linux
wget https://dist.ipfs.io/go-ipfs/v0.12.0/go-ipfs_v0.12.0_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.12.0_linux-amd64.tar.gz
cd go-ipfs
sudo bash install.sh
```

2. Initialize and start IPFS:
```bash
# Initialize IPFS
ipfs init

# Configure CORS
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001

# Start IPFS daemon
ipfs daemon
```

## Project Structure

```bash
src/
  ├── lib/
  │   └── storage/
  │       ├── gateway.ts    # Main gateway implementation
  │       ├── types.ts      # TypeScript interfaces
  │       └── utils.ts      # Helper functions
  ├── components/           # React/Svelte components
  └── config/              # Configuration files
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a specific node
docker-compose restart ipfs-node-1

# Check node status
docker exec ipfs-node-1 ipfs swarm peers
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Check TypeScript types
npm run check
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# IPFS Node Configuration
IPFS_PRIMARY_NODE=http://localhost:5001
IPFS_BACKUP_NODE=http://localhost:5002
IPFS_REPLICATION_FACTOR=3

# Storage Configuration
MAX_FILE_SIZE=100000000  # 100MB in bytes
PIN_TIMEOUT=300000       # 5 minutes in milliseconds
```

## Production Deployment

For production deployment, update the node URLs in `gateway.ts`:

```typescript
const GATEWAY_CONFIG = {
  nodes: [
    { url: process.env.IPFS_PRIMARY_NODE, type: 'primary' },
    { url: process.env.IPFS_BACKUP_NODE, type: 'backup' },
    { url: 'https://ipfs.io', type: 'public' }
  ]
};
```

Then build and start:
```bash
npm run build
npm start
```

## Monitoring

Check gateway status:
```bash
# View IPFS node status
curl http://localhost:5001/api/v0/id

# Check peers
curl http://localhost:5001/api/v0/swarm/peers

# View pinned files
curl http://localhost:5001/api/v0/pin/ls
```

## Common Issues

1. If CORS errors occur:
```bash
# Restart IPFS with correct CORS settings
ipfs shutdown
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs daemon
```

2. If connection refused:
```bash
# Check if IPFS daemon is running
ps aux | grep ipfs

# Remove repo.lock if needed
rm -f ~/.ipfs/repo.lock
```

## License

MIT

---

For more detailed documentation, please refer to the [official documentation](https://git.fybx.dev/fyb/zkl-docs).
