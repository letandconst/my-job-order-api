const { gql } = require('graphql-tag');

const userTypeDefs = require('./typeDefs/user');
const mechanicTypeDefs = require('./typeDefs/mechanic');
const serviceTypeDefs = require('./typeDefs/serviceType');
const partTypeDefs = require('./typeDefs/part');
const jobOrderTypeDefs = require('./typeDefs/jobOrder');
const reportTypeDefs = require('./typeDefs/report');
const clientTypeDefs = require('./typeDefs/client');
const baseTypeDefs = gql`
	scalar JSON

	"""
	Generic response wrapper for all services.
	"""
	type BaseResponse {
		statusCode: Int!
		message: String!
		data: JSON
	}

	# Root types need to exist so other modules can extend them
	type Query
	type Mutation
`;

module.exports = [baseTypeDefs, userTypeDefs, mechanicTypeDefs, serviceTypeDefs, partTypeDefs, jobOrderTypeDefs, reportTypeDefs, clientTypeDefs];
