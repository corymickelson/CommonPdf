#!/usr/bin/env bash
rm pdftk-example.zip
rm -rf dist
mkdir dist
cp package.json dist/
cp index.js dist/
cp config.json dist/
cp -r src/ dist/
cp -r bin/ dist/
cd dist && npm i --production
zip ../index.zip *
