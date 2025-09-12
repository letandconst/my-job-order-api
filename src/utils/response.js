const formatResponse = (statusCode, message, data = null) => ({
	statusCode,
	message,
	...(data && { data }),
});
module.exports = { formatResponse };
