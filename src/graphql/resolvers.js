const userResolvers = require('./resolvers/user.resolver');
const mechanicResolvers = require('./resolvers/mechanic.resolver');
const serviceTypeResolvers = require('./resolvers/serviceType.resolver');
const partResolvers = require('./resolvers/part.resolver');
const jobOrderResolver = require('./resolvers/jobOrder.resolver');
const reportResolver = require('./resolvers/report.resolver');
const clientResolver = require('./resolvers/client.resolver');
const stockTransactionResolver = require('./resolvers/stock.resolver');

module.exports = [userResolvers, mechanicResolvers, serviceTypeResolvers, partResolvers, jobOrderResolver, reportResolver, clientResolver, stockTransactionResolver];
