#!/bin/bash
# EigenCompute TEE entrypoint
if [ -f "/usr/local/bin/compute-source-env.sh" ]; then
    source /usr/local/bin/compute-source-env.sh
fi

exec node server.js
