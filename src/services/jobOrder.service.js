const JobOrder = require('../models/JobOrder');
const Part = require('../models/Parts');
const Service = require('../models/ServiceType');
const Mechanic = require('../models/Mechanic');
const Client = require('../models/Client');
const { formatResponse } = require('../utils/response');

const { createJobOrderValidator, updateJobOrderValidator, updateJobOrderStatusValidator } = require('../validators/jobOrderValidator');

const createJobOrder = async (input) => {
	try {
		await createJobOrderValidator.validate(input, { abortEarly: false });

		const { clientId, carId, assignedMechanicId, parts, workRequested } = input;

		// Validate client and car
		const client = await Client.findById(clientId);
		if (!client) return formatResponse(404, 'Client not found');

		const car = client.cars.id(carId);
		if (!car) return formatResponse(404, 'Car not found for this client');

		// Validate mechanic
		const mechanic = await Mechanic.findById(assignedMechanicId);
		if (!mechanic) return formatResponse(404, 'Mechanic not found');

		// Map parts with snapshot price
		let partsData = [];
		let totalPartsPrice = 0;
		if (parts?.length) {
			for (const p of parts) {
				const partDoc = await Part.findById(p.partId);
				if (!partDoc) return formatResponse(404, `Part not found: ${p.partId}`);
				const subtotal = partDoc.price * p.quantity;
				totalPartsPrice += subtotal;
				partsData.push({
					part: partDoc._id,
					quantity: p.quantity,
					price: partDoc.price,
				});
			}
		}

		// Map services with snapshot price
		let workData = [];
		let totalLabor = 0;
		if (workRequested?.length) {
			for (const w of workRequested) {
				const serviceDoc = await Service.findById(w.serviceId);
				if (!serviceDoc) return formatResponse(404, `Service not found: ${w.serviceId}`);
				totalLabor += serviceDoc.amount;
				workData.push({
					service: serviceDoc._id,
					price: serviceDoc.amount,
				});
			}
		}

		const total = totalLabor + totalPartsPrice;

		const jobOrder = await JobOrder.create({
			client: client._id,
			car: car._id,
			assignedMechanic: mechanic._id,
			parts: partsData,
			workRequested: workData,
			totalLabor,
			totalPartsPrice,
			total,
			status: 'pending',
			history: [{ status: 'pending', updatedBy: 'system' }],
		});

		return formatResponse(201, 'Job order created successfully', jobOrder);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create job order');
	}
};

const updateJobOrder = async (input) => {
	try {
		await updateJobOrderValidator.validate(input, { abortEarly: false });
		const { jobOrderId, clientId, carId, assignedMechanicId, parts, workRequested } = input;

		const jobOrder = await JobOrder.findById(jobOrderId).populate('parts.part').populate('workRequested.service');

		if (!jobOrder) return formatResponse(404, 'Job order not found');

		if (clientId) {
			const client = await Client.findById(clientId);
			if (!client) return formatResponse(404, 'Client not found');
			jobOrder.client = client._id;
			if (carId) {
				const car = client.cars.id(carId);
				if (!car) return formatResponse(404, 'Car not found for this client');
				jobOrder.car = car._id;
			}
		}

		// Update mechanic if provided
		if (assignedMechanicId) {
			const mechanic = await Mechanic.findById(assignedMechanicId);
			if (!mechanic) return formatResponse(404, 'Mechanic not found');
			jobOrder.assignedMechanic = mechanic._id;
		}

		/**
		 * Handle Parts Update
		 */
		if (parts) {
			// Build a quick lookup from input
			const partsMap = new Map(parts.map((p) => [p.partId, p]));

			// Handle removals (existing but not in new list)
			for (let i = jobOrder.parts.length - 1; i >= 0; i--) {
				const existingPart = jobOrder.parts[i];
				if (!partsMap.has(existingPart.part._id.toString())) {
					// If in progress → restock removed part
					if (jobOrder.status === 'in_progress') {
						const partDoc = await Part.findById(existingPart.part._id);
						partDoc.stock += existingPart.quantity;
						await partDoc.save();
					}
					jobOrder.parts.splice(i, 1);
				}
			}

			// Handle additions/updates
			for (const p of parts) {
				const partDoc = await Part.findById(p.partId);
				if (!partDoc) return formatResponse(404, `Part not found: ${p.partId}`);

				const existingPart = jobOrder.parts.find((item) => item.part._id.equals(p.partId));

				if (existingPart) {
					const qtyDiff = p.quantity - existingPart.quantity;

					if (jobOrder.status === 'in_progress') {
						if (qtyDiff > 0) {
							if (partDoc.stock < qtyDiff) {
								return formatResponse(400, `Insufficient stock for part: ${partDoc.name}`);
							}
							partDoc.stock -= qtyDiff;
						} else if (qtyDiff < 0) {
							partDoc.stock += Math.abs(qtyDiff);
						}
						await partDoc.save();
					}

					existingPart.quantity = p.quantity;
					existingPart.price = partDoc.price;
				} else {
					if (jobOrder.status === 'in_progress') {
						if (partDoc.stock < p.quantity) {
							return formatResponse(400, `Insufficient stock for part: ${partDoc.name}`);
						}
						partDoc.stock -= p.quantity;
						await partDoc.save();
					}
					jobOrder.parts.push({
						part: partDoc._id,
						quantity: p.quantity,
						price: partDoc.price,
					});
				}
			}
		}

		/**
		 * Handle Work Requested Update
		 */
		if (workRequested) {
			const servicesMap = new Map(workRequested.map((w) => [w.serviceId, w]));

			// Handle removals
			for (let i = jobOrder.workRequested.length - 1; i >= 0; i--) {
				const existingService = jobOrder.workRequested[i];
				if (!servicesMap.has(existingService.service._id.toString())) {
					jobOrder.workRequested.splice(i, 1);
				}
			}

			// Handle additions/updates
			for (const w of workRequested) {
				const serviceDoc = await Service.findById(w.serviceId);
				if (!serviceDoc) return formatResponse(404, `Service not found: ${w.serviceId}`);

				const existingService = jobOrder.workRequested.find((item) => item.service._id.equals(w.serviceId));

				if (existingService) {
					existingService.price = serviceDoc.amount;
				} else {
					jobOrder.workRequested.push({
						service: serviceDoc._id,
						price: serviceDoc.amount,
					});
				}
			}
		}

		// 🔹 Recalculate totals
		jobOrder.totalPartsPrice = jobOrder.parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
		jobOrder.totalLabor = jobOrder.workRequested.reduce((sum, w) => sum + w.price, 0);
		jobOrder.total = jobOrder.totalPartsPrice + jobOrder.totalLabor;

		await jobOrder.save();

		return formatResponse(200, 'Job order updated successfully', jobOrder);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update job order');
	}
};

const updateJobOrderStatus = async (input) => {
	try {
		await updateJobOrderStatusValidator.validate(input, { abortEarly: false });
		const { jobOrderId, status, updatedBy } = input;
		const jobOrder = await JobOrder.findById(jobOrderId).populate('parts.part');

		if (!jobOrder) return formatResponse(404, 'Job order not found');

		// Handle stock update on in_progress
		if (status === 'in_progress' && jobOrder.status === 'pending') {
			for (const item of jobOrder.parts) {
				if (item.part.stock < item.quantity) {
					return formatResponse(400, `Insufficient stock for part: ${item.part.name}`);
				}
			}
			for (const item of jobOrder.parts) {
				item.part.stock -= item.quantity;
				await item.part.save();
			}
		}

		jobOrder.status = status;
		jobOrder.history.push({ status, updatedBy });
		await jobOrder.save();

		return formatResponse(200, 'Job order status updated', jobOrder);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update job order');
	}
};

const getJobOrders = async () => {
	try {
		const jobOrders = await JobOrder.find().populate('client').populate('car').populate('assignedMechanic').populate('parts.part').populate('workRequested.service');
		return formatResponse(200, 'Job orders fetched successfully', jobOrders);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch job orders');
	}
};

const getJobOrderById = async (id) => {
	try {
		const jobOrder = await JobOrder.findById(id).populate('client').populate('car').populate('assignedMechanic').populate('parts.part').populate('workRequested.service');
		if (!jobOrder) return formatResponse(404, 'Job order not found');
		return formatResponse(200, 'Job order fetched successfully', jobOrder);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch job order');
	}
};

module.exports = {
	createJobOrder,
	updateJobOrder,
	updateJobOrderStatus,
	getJobOrders,
	getJobOrderById,
};
