const userTypeDefs = require('./typeDefs/user');
const mechanicTypeDefs = require('./typeDefs/mechanic');
const baseTypeDefs = `
  type Query
  type Mutation
`;

module.exports = [baseTypeDefs, userTypeDefs, mechanicTypeDefs];
