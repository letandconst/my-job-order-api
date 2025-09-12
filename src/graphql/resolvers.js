const userResolvers = require('./resolvers/user.resolver');
const mechanicResolvers = require('./resolvers/mechanic.resolver');
const serviceTypeResolvers = require('./resolvers/serviceType.resolver');
module.exports = [userResolvers, mechanicResolvers, serviceTypeResolvers];
