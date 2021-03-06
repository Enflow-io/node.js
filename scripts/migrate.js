const path = require('path');
const {spawn} = require('child-process-promise')
const spawnOptions = { stdio: 'inherit' };
(async () => {
	// Our database URL
	const url = 'postgres://docker_test:NahWe3Chuthuaw@postgresfortest:5432/mir_tesen_test' // TODO: get from config
	try {
		// Migrate the DB
		await spawn('node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions);
		console.log('*************************');
		console.log('Migration successful');
	} catch (err) {
		// Oh no!
		console.log('*************************');
		console.log('Migration failed. Error:', err.message);
		process.exit(1);
	}
	process.exit(0);
})();