const JobOrder = require('../models/JobOrder');
const User = require('../models/User');
const Part = require('./../models/Parts');

// Utility: get date range by period
const getDateRange = (period) => {
	const now = new Date();
	let start;

	switch (period) {
		case 'daily':
			start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			break;
		case 'weekly':
			const firstDay = now.getDate() - now.getDay(); // Sunday start
			start = new Date(now.getFullYear(), now.getMonth(), firstDay);
			break;
		case 'monthly':
			start = new Date(now.getFullYear(), now.getMonth(), 1);
			break;
		case 'yearly':
			start = new Date(now.getFullYear(), 0, 1);
			break;
		default:
			throw new Error('Invalid period');
	}

	return { start, end: now };
};

const getJobOrderReport = async ({ period = null, mechanicId = null, serviceType = null }) => {
	let start, end;

	if (period) {
		const range = getDateRange(period);
		start = range.start;
		end = range.end;
	}

	// ----------------------------
	// Build match query
	// ----------------------------
	const matchQuery = {};
	if (start && end) matchQuery.createdAt = { $gte: start, $lte: end };
	if (mechanicId) matchQuery.assignedMechanic = mechanicId;
	if (serviceType) matchQuery['workRequested.category'] = serviceType; // assuming category is in workRequested

	// ----------------------------
	// Summary stats
	// ----------------------------
	const summary = await JobOrder.aggregate([
		{ $match: matchQuery },
		{
			$group: {
				_id: null,
				totalOrders: { $sum: 1 },
				completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
				pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
				revenue: { $sum: '$total' },
			},
		},
	]);

	const stats = summary[0] || {
		totalOrders: 0,
		completedOrders: 0,
		pendingOrders: 0,
		revenue: 0,
	};

	// ----------------------------
	// Top 3 Mechanics (filtered)
	// ----------------------------
	const topMechanics = await JobOrder.aggregate([
		{ $match: { status: 'completed', ...matchQuery } },
		{ $group: { _id: '$assignedMechanic', totalJobs: { $sum: 1 } } },
		{ $sort: { totalJobs: -1 } },
		{ $limit: 3 },
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'mechanic',
			},
		},
		{ $unwind: '$mechanic' },
		{ $project: { mechanicName: '$mechanic.firstName', totalJobs: 1 } },
	]);

	// ----------------------------
	// Parts Trend (filtered)
	// ----------------------------
	const partTrends = await JobOrder.aggregate([
		{ $match: matchQuery },
		{ $unwind: '$parts' },
		{
			$group: {
				_id: {
					month: { $month: '$createdAt' },
					year: { $year: '$createdAt' },
					part: '$parts.partId',
				},
				totalUsed: { $sum: '$parts.qty' },
			},
		},
		{
			$lookup: {
				from: 'parts',
				localField: '_id.part',
				foreignField: '_id',
				as: 'part',
			},
		},
		{ $unwind: '$part' },
		{
			$project: {
				year: '$_id.year',
				month: '$_id.month',
				partName: '$part.name',
				totalUsed: 1,
			},
		},
		{ $sort: { year: 1, month: 1 } },
	]);

	return {
		...stats,
		topMechanics,
		partTrends,
	};
};

module.exports = { getJobOrderReport };
