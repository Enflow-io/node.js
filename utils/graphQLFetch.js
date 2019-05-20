const fetch = require('isomorphic-fetch')


const GraphQLFetch = (params = { url: '',  body: '', endpoint: '', headers: {} }) => {
	if (!params.url || params.url === '') params.url = `/gqapi/${params.endpoint}/v1`;
	const headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		...params.headers
	};
	return fetch(
		params.url,
		{
			method: 'post',
			credentials: 'same-origin',
			body: params.body,
			headers
		})
		.then(response => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};


// export default GraphQLFetch;
module.exports = GraphQLFetch
