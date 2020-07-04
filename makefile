landing-dev:
	cd landing && npm run dev

landing-build:
	cd landing && npm run export

move_landing_build:
	cp -R ./landing/__sapper__/export ./public

prebuild:
	rm -rf ./public && mkdir ./public

firebase_deploy:
	firebase deploy

firebase_serve:
	firebase serve

cleanup:
	rm -rf landing/__sapper__

build: prebuild landing-build move_landing_build

deploy: build firebase_deploy

start: build firebase_serve

