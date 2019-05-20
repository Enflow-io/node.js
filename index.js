const express = require('express');
const server = require('express-graphql');
const {buildSchema} = require('graphql');
const GraphQLJSON = require( 'graphql-type-json');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const { importSchema } = require('graphql-import')
const { GraphQLDateTime } = require('graphql-iso-date');
const jwtSecret = 'makethislongandrandom';
const AuthUser = require('./utils/authUser')

const ENV = 'development'
var models = require('./models');
var Poll = models.Poll;
var User = models.User;
var Vote = models.Vote;
var Enum = require('enum');
const COLORS = new Enum(
	{
		'white': 1,
		'black': 2,
		'pink': 3,
		'orange': 4,
		'blue': 5,
		'green': 6
	},
	{ ignoreCase: true });




const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const schema = buildSchema(typeDefs);





const rootValue = {
	async createPoll(params, req) {

		const userID = await AuthUser(req)
		if(!userID){
			return null
		}

		let {answers, color_scheme, title, finishTime} = params;

		color_scheme = COLORS[color_scheme].value;



		let poll = await Poll.build({
			answers,
			color_scheme,
			title,
			finishTime,
			userID
		})
		return await poll.save();

	},
	async updatePoll(params, req) {

		const userID = await AuthUser(req)
		if(!userID){
			return null
		}

		let {pollID, answers, color_scheme, title, finishTime} = params;

		color_scheme = COLORS[color_scheme].value;

		let poll = await Poll.findByPk(pollID)

		if(poll.userID !== userID){
			return null;
		}

		return await poll.update({
			answers,
			color_scheme,
			title,
			finishTime
		})
	},
	async poll({id}, req) {

		const poll = await Poll.findById(id)
		const userID = await AuthUser(req)

		if(userID){
			await poll.isVoted(userID)
		}

		poll.color_scheme = COLORS.get(parseInt(poll.color_scheme))
		return poll
	},
	async createVote({pollID, answerID  }, req){
		const userID = await AuthUser(req)
		if(!userID){
			return null
		}

		let vote = await Vote.build({pollID, answerID, userID})
		await vote.save()
		console.log("VoteID: ", vote.id)
		let seq = models.sequelize

		// Row query is required by client
		let res = await seq.query('SELECT COUNT(*) FROM "Votes" WHERE "pollID" = :poll_id',
			{ replacements: { poll_id: pollID}, type: seq.QueryTypes.SELECT }
		)
		console.log("Res: ", res[0].count)
		let count = res[0].count
		let poll = await Poll.findById(pollID);
		await poll.calculate({count});

		vote.poll = poll
		return vote;
	},
	async getUser(params, req){



		let cookies = {
			told: req.headers.told,
			// told: "c61554ea7ea12431aae32b55958dc572",
			htold: req.headers.htold,
			// htold: "4c3f597c22ee5bd6cb46c0c26f1c1eb9",
		}




		return {data: AuthUser(cookies)}


	}


};



const app = express();
const port = 3001

app.use(function(req, res, next) {

	// For staging
	if (req.method === 'OPTIONS') {
		var headers = {};
		// IE8 does not allow domains to be specified, just the *
		// headers["Access-Control-Allow-Origin"] = req.headers.origin;
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		headers["Access-Control-Allow-Credentials"] = false;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		res.writeHead(200, headers);
		res.end();
	} else {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	}



});

app.use('', server({
	schema: schema,
	rootValue: rootValue,
	graphiql: true,
}));
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
