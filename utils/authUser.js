const GraphQLFetch = require('./graphQLFetch')

const getCookies = function(req){

	if(!req.headers || !req.headers.told || !req.headers.htold){
		throw Error("Bad Inputs")
	}
	return {
		told: req.headers.told,
		htold: req.headers.htold,
	}
}

const mRequest = async function(cookieString){
	return await GraphQLFetch({
		url: "http://mirtesen.ru/gqapi/auth/v1",
		body: JSON.stringify({
			query: `query {
                        getTokenByCookie{
						    token,
						    uid
						  }
                    }` }),
		headers: {
			'Cookie': cookieString
		}
	});
}

const authUser = async (req, auth=undefined) => {


	try {
		const cookies = getCookies(req)
		const cookieString = ['told', 'htold', 'token']
			.filter(item => cookies[item] !== undefined)
			.map(item => `${item}=${cookies[item]}`)
			.join('; ');


		if (cookieString === '') {
			return {data: {"id": 0}}
		}


		let authRequest = auth ? auth : mRequest;

		console.log("COOKIE: ", cookieString)
		let result = await authRequest(cookieString)
		console.log("AUTH_RES: ", result)
		result = result.data.getTokenByCookie;

		if (!result.uid || result.uid === undefined || result.uid === 0) {
			return false
		} else {
			return result.uid
		}
	}catch (e) {
		throw `Error when userAuth: ${e.message}`
	}
}

module.exports = authUser;