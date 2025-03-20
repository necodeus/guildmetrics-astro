#!/bin/bash

source ~/.nvm/nvm.sh
nvm use

npx swagger-typescript-api -p http://localhost:9080/swagger/doc.json -o ./src -n myApi.ts

export GUILDMETRICS_API_URL=http://localhost:9080
npm run dev
