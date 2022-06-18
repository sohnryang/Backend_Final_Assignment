#!/usr/bin/env bash
cd ./packages/frontend/
npm install
npm run build
cd ../backend/
npm install
npm run build
