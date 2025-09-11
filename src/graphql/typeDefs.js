const userTypeDefs = require('./typeDefs/user');

const baseTypeDefs = `
  type Query
  type Mutation
`;

module.exports = [baseTypeDefs, userTypeDefs];
