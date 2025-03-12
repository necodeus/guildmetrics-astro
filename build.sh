#!/bin/bash

npm run build

export PORT=3000
export GUILDMETRICS_API_URL=http://localhost:9080
cd dist/server
node entry.mjs
