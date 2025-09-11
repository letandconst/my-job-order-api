const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');

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

	app.use(
		'/graphql',
		cors(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const authHeader = req.headers.authorization || '';
				if (authHeader.startsWith('Bearer ')) {
					const token = authHeader.split(' ')[1];
					const user = verifyToken(token);
					if (user) return { user };
				}
				return {};
			},
		})
	);

	app.listen(port, () => {
		console.log(`🚀 Server running at http://localhost:${port}/graphql`);
	});
})();
