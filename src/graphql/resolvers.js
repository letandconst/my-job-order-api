const userResolvers = require('./resolvers/user.resolver');
const mechanicResolvers = require('./resolvers/mechanic.resolver');
const serviceTypeResolvers = require('./resolvers/serviceType.resolver');
const partResolvers = require('./resolvers/part.resolver');
const jobOrderResolver = require('./resolvers/jobOrder.resolver');
module.exports = [userResolvers, mechanicResolvers, serviceTypeResolvers, partResolvers, jobOrderResolver];
