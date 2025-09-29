const JobOrder = require('../models/JobOrder');
const Part = require('../models/Parts');
const Service = require('../models/ServiceType');
const Mechanic = require('../models/Mechanic');
const Client = require('../models/Client');
const { createJobOrderValidator, updateJobOrderValidator, updateJobOrderStatusValidator } = require('../validators/jobOrderValidator');
const { createStockTransaction } = require('./stock.service');

// ---------------------- CREATE ----------------------
const createJobOrder = async (_, { input }) => {
	try {
		await createJobOrderValidator.validate(input, { abortEarly: false });

		const { clientId, carId, assignedMechanicId, parts, workRequested, notes } = input;

		// Validate client and car
		const client = await Client.findById(clientId);
		if (!client) throw new Error('Client not found');

		const car = client.cars.id(carId);
		if (!car) throw new Error('Car not found for this client');

		// Validate mechanic
		const mechanic = await Mechanic.findById(assignedMechanicId);
		if (!mechanic) throw new Error('Mechanic not found');

		// Parts snapshot
		let partsData = [];
		let totalPartsPrice = 0;
		if (parts?.length) {
			for (const p of parts) {
				const partDoc = await Part.findById(p.partId);
				if (!partDoc) throw new Error(`Part not found: ${p.partId}`);
				const subtotal = partDoc.price * p.quantity;
				totalPartsPrice += subtotal;
				partsData.push({
					part: partDoc._id,
					quantity: p.quantity,
					price: partDoc.price,
				});
			}
		}

		// Services snapshot
		let workData = [];
		let totalLabor = 0;
		if (workRequested?.length) {
			for (const w of workRequested) {
				const serviceDoc = await Service.findById(w.serviceId);
				if (!serviceDoc) throw new Error(`Service not found: ${w.serviceId}`);
				totalLabor += serviceDoc.amount;
				workData.push({
					service: serviceDoc._id,
					price: serviceDoc.amount,
				});
			}
		}

		const total = totalLabor + totalPartsPrice;

		const initialNotes = notes?.length
			? notes.map((n) => ({
					message: n.message,
					addedBy: n.addedBy,
					createdAt: new Date(),
			  }))
			: [];

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
			notes: initialNotes,
		});

		return jobOrder;
	} catch (err) {
		throw new Error(err.message || 'Failed to create job order');
	}
};

// ---------------------- UPDATE ----------------------
const updateJobOrder = async (_, { input }) => {
	try {
		await updateJobOrderValidator.validate(input, { abortEarly: false });
		const { jobOrderId, clientId, carId, assignedMechanicId, parts, workRequested, notes } = input;

		const jobOrder = await JobOrder.findById(jobOrderId).populate('parts.part').populate('workRequested.service');

		if (!jobOrder) throw new Error('Job order not found');

		// --- Client & Car ---
		if (clientId) {
			const client = await Client.findById(clientId);
			if (!client) throw new Error('Client not found');
			jobOrder.client = client._id;

			if (carId) {
				const car = client.cars.id(carId);
				if (!car) throw new Error('Car not found for this client');
				jobOrder.car = car._id;
			}
		}

		// --- Mechanic ---
		if (assignedMechanicId) {
			const mechanic = await Mechanic.findById(assignedMechanicId);
			if (!mechanic) throw new Error('Mechanic not found');
			jobOrder.assignedMechanic = mechanic._id;
		}

		// --- Notes ---
		if (notes?.length) {
			notes.forEach((n) => {
				if (n.message && n.addedBy) {
					jobOrder.notes.push({
						message: n.message,
						addedBy: n.addedBy,
						createdAt: new Date(),
					});
				}
			});
		}

		// --- Parts ---
		if (parts) {
			const partsMap = new Map(parts.map((p) => [p.partId, p]));

			// Remove parts not in new list
			for (let i = jobOrder.parts.length - 1; i >= 0; i--) {
				const existingPart = jobOrder.parts[i];
				if (!partsMap.has(existingPart.part._id.toString())) {
					// Restock if already in progress
					if (jobOrder.status === 'in_progress') {
						await createStockTransaction(
							{
								partId: existingPart.part._id,
								jobOrderId: jobOrder._id,
								type: 'IN',
								quantity: existingPart.quantity,
								reference: `JobOrderUpdate-Remove-${jobOrder._id}`,
							},
							'System'
						);
					}
					jobOrder.parts.splice(i, 1);
				}
			}

			// Add or update parts
			for (const p of parts) {
				const partDoc = await Part.findById(p.partId);
				if (!partDoc) throw new Error(`Part not found: ${p.partId}`);

				const existingPart = jobOrder.parts.find((item) => item.part._id.equals(p.partId));

				if (existingPart) {
					const qtyDiff = p.quantity - existingPart.quantity;

					if (jobOrder.status === 'in_progress' && qtyDiff !== 0) {
						await createStockTransaction(
							{
								partId: partDoc._id,
								jobOrderId: jobOrder._id,
								type: qtyDiff > 0 ? 'OUT' : 'IN',
								quantity: Math.abs(qtyDiff),
								reference: `JobOrderUpdate-QtyChange-${jobOrder._id}`,
							},
							'System'
						);
					}

					existingPart.quantity = p.quantity;
					existingPart.price = partDoc.price;
				} else {
					if (jobOrder.status === 'in_progress') {
						await createStockTransaction(
							{
								partId: partDoc._id,
								jobOrderId: jobOrder._id,
								type: 'OUT',
								quantity: p.quantity,
								reference: `JobOrderUpdate-Add-${jobOrder._id}`,
							},
							'System'
						);
					}
					jobOrder.parts.push({
						part: partDoc._id,
						quantity: p.quantity,
						price: partDoc.price,
					});
				}
			}
		}

		// --- Services ---
		if (workRequested) {
			const servicesMap = new Map(workRequested.map((w) => [w.serviceId, w]));

			// Remove services not in new list
			for (let i = jobOrder.workRequested.length - 1; i >= 0; i--) {
				const existingService = jobOrder.workRequested[i];
				if (!servicesMap.has(existingService.service._id.toString())) {
					jobOrder.workRequested.splice(i, 1);
				}
			}

			// Add or update services
			for (const w of workRequested) {
				const serviceDoc = await Service.findById(w.serviceId);
				if (!serviceDoc) throw new Error(`Service not found: ${w.serviceId}`);

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

		// --- Totals ---
		jobOrder.totalPartsPrice = jobOrder.parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
		jobOrder.totalLabor = jobOrder.workRequested.reduce((sum, w) => sum + w.price, 0);
		jobOrder.total = jobOrder.totalPartsPrice + jobOrder.totalLabor;

		await jobOrder.save();

		return jobOrder;
	} catch (err) {
		throw new Error(err.message || 'Failed to update job order');
	}
};

// ---------------------- STATUS ----------------------
const updateJobOrderStatus = async (_, { input }) => {
	try {
		await updateJobOrderStatusValidator.validate(input, { abortEarly: false });

		const { jobOrderId, status, updatedBy } = input;
		const jobOrder = await JobOrder.findById(jobOrderId).populate('parts.part');
		if (!jobOrder) throw new Error('Job order not found');

		// Transition: pending → in_progress
		if (status === 'in_progress' && jobOrder.status === 'pending') {
			for (const item of jobOrder.parts) {
				if (item.part.stock < item.quantity) {
					throw new Error(`Insufficient stock for part: ${item.part.name}`);
				}
			}

			for (const item of jobOrder.parts) {
				await createStockTransaction(
					{
						partId: item.part._id,
						jobOrderId: jobOrder._id,
						type: 'OUT',
						quantity: item.quantity,
						reference: `JobOrder-${jobOrder._id}`,
					},
					updatedBy
				);
			}
		}

		// Update status
		const formattedStatus = status
			.split('_')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');

		jobOrder.status = status;
		jobOrder.history.push({ status, updatedBy });
		jobOrder.notes.push({
			message: `Status changed to ${formattedStatus}`,
			addedBy: updatedBy || 'system',
			createdAt: new Date(),
		});

		await jobOrder.save();

		return jobOrder;
	} catch (err) {
		throw new Error(err.message || 'Failed to update job order');
	}
};

// ---------------------- FETCH ----------------------
const getJobOrders = async () => {
	try {
		return await JobOrder.find().populate('client').populate('car').populate('assignedMechanic').populate('parts.part').populate('workRequested.service');
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch job orders');
	}
};

const getJobOrderById = async (_, { id }) => {
	try {
		const jobOrder = await JobOrder.findById(id).populate('client').populate('car').populate('assignedMechanic').populate('parts.part').populate('workRequested.service');

		if (!jobOrder) throw new Error('Job order not found');
		return jobOrder;
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch job order');
	}
};

module.exports = {
	createJobOrder,
	updateJobOrder,
	updateJobOrderStatus,
	getJobOrders,
	getJobOrderById,
};
