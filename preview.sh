#!/bin/bash

source ~/.nvm/nvm.sh
nvm use v20.11.0

npm run build

export GUILDMETRICS_API_URL=http://localhost:9080
cd dist/server
node entry.mjs
