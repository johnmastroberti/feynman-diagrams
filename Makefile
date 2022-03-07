dist/all.js: js/*.js
	mkdir -p dist
	cat js/*.js | terser > dist/all.js

run: dist/all.js
	darkhttpd .
.PHONY: run
