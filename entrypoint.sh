#!/bin/bash

# EigenCompute TEE Entry Point

# Source sealed secrets (available in TEE)
if [ -f "/usr/local/bin/compute-source-env.sh" ]; then
    source /usr/local/bin/compute-source-env.sh
fi

echo "Starting CORTEX..."

# Start the application
exec node server.js
