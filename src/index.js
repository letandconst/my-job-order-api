const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authMiddleware } = require('./middlewares/auth');
require('./config/db')(); // connect to MongoDB

const app = express();
const port = process.env.PORT || 4000;

const { verifyToken } = require('./services/auth.service');

// Apollo Server setup
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

(async () => {
	await server.start();

	app.use(cors());
	app.use(express.json());
	app.use(cookieParser());

	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				let user = null;

				// First check for accessToken cookie
				if (req.cookies?.accessToken) {
					user = verifyToken(req.cookies.accessToken, process.env.JWT_SECRET);
				}

				// Fallback: check Authorization header (Bearer token)
				if (!user) {
					const authHeader = req.headers.authorization || '';
					if (authHeader.startsWith('Bearer ')) {
						const token = authHeader.split(' ')[1];
						user = verifyToken(token, process.env.JWT_SECRET);
					}
				}

				return { req, res, user };
			},
		})
	);

	app.listen(port, () => {
		console.log(`🚀 Server running at http://localhost:${port}/graphql`);
	});
})();
