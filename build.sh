#!/bin/sh

rm -fr dist
r.js -o build.js

echo -n 'cleaning up dist...'
# cleanup dist
cd dist
# remove extraneous
rm -fr .git .gitignore \
   bower.json .bowerrc \
   build.js build.sh build.txt

cd app/vendor
mkdir -p ../keep/radar-chart-d3/src/
mv radar-chart-d3/src/radar-chart.css ../keep/radar-chart-d3/src/
mkdir -p ../keep/bootstrap/dist/
mv bootstrap/dist/css bootstrap/dist/fonts ../keep/bootstrap/dist/
mkdir -p ../keep/requirejs
mv requirejs/require.js ../keep/requirejs
rm -fr *
mv ../keep/* .
rm -fr ../keep

echo done
