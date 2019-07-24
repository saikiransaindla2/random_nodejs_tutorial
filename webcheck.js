const isReachable = require('is-reachable');

(async () => {
	console.log('google', await isReachable('https://google.com',{timeout:500}));
	//=> true

    console.log('amazon', await isReachable('https://amazon.com',{timeout: 10}));
    console.log('facebook', await isReachable('https://facebook.com',{timeout:10}));
    console.log('app', await isReachable('https://app.test',{timeout:10}));
	//=> true
})();