const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('./config/db')();

const { verifyToken } = require('./services/auth.service');

const app = express();
const port = process.env.PORT || 4000;

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

(async () => {
	await server.start();

	app.use(
		cors({
			origin: process.env.FRONTEND_URL,
			credentials: true,
		})
	);
	app.use(cookieParser());

	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				let user = null;

				if (req.cookies?.accessToken) {
					user = verifyToken(req.cookies.accessToken, process.env.JWT_SECRET);
				}

				return { req, res, user };
			},
		})
	);

	app.listen(port, () => {
		console.log(`🚀 Server running at http://localhost:${port}/graphql`);
	});
})();
