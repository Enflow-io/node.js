'use strict';
module.exports = (sequelize, DataTypes) => {
	var Poll = sequelize.define('Poll', {
		answers: DataTypes.JSON,
		color_scheme: DataTypes.INTEGER,
		finishTime: DataTypes.DATE,
		title: DataTypes.STRING,
		votes_counter: DataTypes.INTEGER,
		percentage: DataTypes.JSON,
		userID: DataTypes.INTEGER
	});


	Poll.associate = function (models) {
		// associations can be defined here
		Poll.hasMany(models.Vote, {as: 'votes', foreignKey: 'pollID', sourceKey: 'id'})

	};

	Poll.prototype.calculate = async function(payload){

		let {count} = payload;

		let size = null;
		if(count){
			size = count
		}else{
			let res = await sequelize.query('SELECT COUNT(*) FROM "Votes" WHERE "pollID" = :poll_id',
				{ replacements: { poll_id: this.id}, type: sequelize.QueryTypes.SELECT }
			)

			size = res[0].count;

		}


		// Calculate percentage
		const answers = this.answers;

		let percentage = answers.map(async el=>{

			let res = await sequelize.query('SELECT COUNT(*) FROM "Votes" WHERE "pollID" = :poll_id AND "answerID" = :answer_id',
				{ replacements: { poll_id: this.id, answer_id: el.id }, type: sequelize.QueryTypes.SELECT }
			)

			const count = res[0].count

			// console.log(res)
			// console.log(count)
			// console.log(size)
			return {
				answerID: el.id,
				percent: Math.round(count / size * 100)
			}
		})

		percentage = await Promise.all(percentage);

		percentage.sort((item1, item2)=>{
			return item2.percent - item1.percent;
		})

		percentage[0].lead = true

		await this.update({
			votes_counter: size,
			percentage
		});

		return this
	}


	Poll.prototype.isVoted = async function(userID){
		// let res = await sequelize.query('SELECT COUNT(*) FROM "Votes" WHERE "pollID" = :poll_id AND "answerID" = :answer_id',
		let res = await sequelize.query('SELECT "answerID" FROM "Votes" WHERE "userID" = :user_id AND "pollID" = :poll_id ORDER BY "id" DESC LIMIT 1 ',
			{ replacements: { user_id: userID, poll_id: this.id }, type: sequelize.QueryTypes.SELECT }
		)


		this.voted = res
		return this;
	}

	return Poll;
};