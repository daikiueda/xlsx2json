mocha=./node_modules/mocha/bin/_mocha
istanbul=./node_modules/istanbul/lib/cli.js
coveralls=./node_modules/coveralls/bin/coveralls.js

test-cov: clean
	node $(istanbul) cover $(mocha) --report lcovonly -- --recursive -R spec

coveralls: 
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

clean:
	rm -fr coverage