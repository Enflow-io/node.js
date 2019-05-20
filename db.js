const Sequelize = require('sequelize');
const dbConfig = require('./config/config.json')[ENV]

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	dialect: 'postgres',
	"port": 6432,
	"replication": {
		"read": [
			{"host": "ssel3.mtml.ru", "username": "polls", "password": ""},
			{"host": "ssel4.mtml.ru", "username": "polls", "password": ""}
		],
		"write": {"host": "ssel3.mtml.ru", "username": "polls", "password": ""}

	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
	operatorsAliases: false
});

module.exports = sequelize
