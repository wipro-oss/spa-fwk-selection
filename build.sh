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
cp jquery/dist/jquery.js .
rm -fr jquery/*
mkdir jquery/dist
mv jquery.js jquery/dist


cp -r bootstrap/dist .
rm -fr bootstrap/*
mv dist bootstrap/
rm -fr bootstrap/dist/js/bootstrap.min.js bootstrap/dist/js/npm.js \
   bootstrap/dist/css/*.map

cp handlebars/handlebars.js .
rm -fr handlebars/*
mv handlebars.js handlebars/

cp text/text.js .
rm -fr text/*
mv text.js text/


cp d3/d3.js .
rm -fr d3/*
mv d3.js d3/

cp radar-chart-d3/src/radar-chart.js radar-chart-d3/src/radar-chart.css .
rm -fr radar-chart-d3/*
mkdir radar-chart-d3/src/
mv radar-chart.* radar-chart-d3/src/

rm -fr requirejs/*.json requirejs/*.md
echo done
