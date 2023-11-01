#!/bin/bash

cd /cubitorium/backend/ 
solana-test-validator --quiet &
sleep 5
solana config set --url localhost

yarn
yarn build
anchor deploy

mv /cubitorium/keypar.json

yarn init-backend

cd /cubitorium/client
yarn
yarn build
yarn dev --host
