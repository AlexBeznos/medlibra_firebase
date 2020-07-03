landing-dev:
	cd landing && npm run dev

landing-build:
	cd landing && npm run build_for_functions

move_landing_build:
	cp -R ./landing/functions/__sapper__/build ./functions/__sapper__

prebuild:
	rm -rf functions/__sapper__/build && mkdir -p functions/__sapper__/build

firebase_deploy:
	firebase deploy

firebase_serve:
	firebase serve

cleanup:
	rm -rf functions/__sapper__ && rm -rf landing/__sapper__ && rm -rf landing/functions

build: prebuild landing-build move_landing_build

deploy: build firebase_deploy

start: build firebase_serve

