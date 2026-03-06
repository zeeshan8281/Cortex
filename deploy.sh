#!/bin/bash
export ECLOUD_PRIVATE_KEY="0xdf060fbd5881c815b13125e258d5db0e4ff175c7f5a3bbd5ccccc61fe6ea7152"
/Users/zeeshan/.npm/_npx/ef96f67cfe85f760/node_modules/.bin/ecloud compute app deploy --verifiable --repo "https://github.com/zeeshan8281/Cortex" --commit 3ccae5c6050f26475f1ff04a9075c63124a440c0 --env-file "/Users/zeeshan/Downloads/cortex/.env.production" --name cortex --rpc-url "https://sepolia.drpc.org" --build-caddyfile Caddyfile --verbose
