all.js: js/*.js
	cat js/*.js > all.js

run: all.js
	darkhttpd .
.PHONY: run
