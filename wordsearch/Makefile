.PHONY: build clean install run

default: build

install:
	npm install -g typescript --save-dev @types/css-font-loading-module

build:
	tsc --lib 'ES6','DOM' src/*.ts

clean:
	rm src/*.js

run:
	python3 -m http.server
