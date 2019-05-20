var assert = require('assert');
const truncate = require('./../scripts/truncate.db')
const Poll = require('./../models/index').Poll
const Vote = require('./../models/index').Vote

describe('Poll', function () {

	before(async () => {
		await truncate();
		return true;
	});


	describe('Create', function () {

		it('When fields are not correct', async function () {

			try {
				let result = await Poll.build({
					answers: [],
					color_scheme: 'asdfa',
					title: 'as'
				}).save()

				assert.equal(true, false);
			} catch (e) {
				assert.equal(true, true);

			}

		});


		it('should saves correctly', async function () {
			let result = await Poll.build({
				answers: [
					{
						id: 1,
						title: 'tit1'
					},
					{
						id: 2,
						title: 'tit2'
					}],
				color_scheme: 1,
				title: 'Title'
			}).save()

			assert.equal(result.title, 'Title')
			assert.equal(result.color_scheme, 1)


		});


	});




	describe('Calculate', function () {

			it('Calculates right values', async function () {
				let poll = await Poll.build({
					answers: [
						{
							id: 1,
							title: 'tit1'
						},
						{
							id: 2,
							title: 'tit2'
						}],
					color_scheme: 1,
					title: 'Title'
				}).save()

				let vote1 = await Vote.build({
					userID: 1,
					pollID: poll.id,
					answerID: 1
				}).save()

				let vote2 = await Vote.build({
					userID: 1,
					pollID: poll.id,
					answerID: 2
				}).save()

				// poll = await Poll.findById(poll.id)
				await poll.calculate()

				assert.equal(poll.votes_counter, 2)

			});

	})


});