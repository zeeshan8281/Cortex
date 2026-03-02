#!/bin/bash

# EigenCompute TEE Entry Point
# This script sources sealed environment variables and starts the app

# Source sealed secrets (available in TEE)
if [ -f "/usr/local/bin/compute-source-env.sh" ]; then
    source /usr/local/bin/compute-source-env.sh
fi

# Log startup
echo "=========================================="
echo "CORTEX Starting"
echo "=========================================="
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "EigenDA Proxy: $EIGENDA_PROXY_URL"
echo "TEE Attestation: Enabled"
echo "=========================================="

# Start the application
exec node server.js
