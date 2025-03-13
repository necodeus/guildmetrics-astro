#!/bin/bash

source ~/.nvm/nvm.sh
nvm use v20.11.0

export GUILDMETRICS_API_URL=http://localhost:9080
npm run dev
