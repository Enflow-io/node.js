var assert = require('assert');
const truncate = require('./../scripts/truncate.db')

const authUser = require('./../utils/authUser')

describe('Auth User', function () {

	before(async () => {
		return  await truncate()
	});

	describe('When success', function () {
		it('should return user ID', async function () {
			let result = await authUser({
				headers: {
					told: 'c61554ea7ea12431aae32b55958dc572',
					htold: 'c61554ea7ea12431aae32b55958dc572',
				}
			}, () => {
				return {
					data: {
						getTokenByCookie: {
							uid: 1
						}
					}
				}
			})


			assert.equal(result, 1)
		});
	});

	describe('When fails', function () {
		it('should return false', async function () {
			let result = await authUser({
				headers: {
					told: 'c61554ea7ea12431aae32b55958dc572',
					htold: 'c61554ea7ea12431aae32b55958dc572',
				}
			}, () => {
				return {
					data: {
						getTokenByCookie: {
							uid: null
						}
					}
				}
			})


			assert.equal(result, false)
		});
	});


	describe('When auth server doesnt work', function () {
		it('should throw exception', async function () {

				await authUser({
						headers: {
							told: 'c61554ea7ea12431aae32b55958dc572',
							htold: 'c61554ea7ea12431aae32b55958dc572',
						}
					}, () => {
						throw Error('err')
					}).then(e=>{
						throw Error('Should be error')
				})
					.catch(e=>{
					assert.equal(e, "Error when userAuth: err");
				})
		});
	});

	describe('When inputs are not correct', function () {
		it('should throw exception', async function () {
			await authUser({
				badInputs: false
			}).then(e=>{
				throw Error('Should be error')
			})
				.catch(e=>{
					assert.equal(e, "Error when userAuth: Bad Inputs");
				})
		});
	});


});