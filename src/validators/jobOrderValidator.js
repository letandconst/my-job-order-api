const yup = require('yup');

// Part and Service schemas (assuming you already have them)
const jobOrderPartSchema = yup.object({
	partId: yup.string().required('Part ID is required'),
	quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
});

const jobOrderServiceSchema = yup.object({
	serviceId: yup.string().required('Service ID is required'),
});

// ---------------- CREATE JOB ORDER ----------------
const createJobOrderValidator = yup.object({
	clientId: yup.string().required('Client ID is required'),
	carId: yup.string().required('Car ID is required'),
	assignedMechanicId: yup.string().required('Assigned mechanic is required'),
	parts: yup.array().of(jobOrderPartSchema).optional(),
	workRequested: yup.array().of(jobOrderServiceSchema).optional(),
});

// ---------------- UPDATE JOB ORDER ----------------
const updateJobOrderValidator = yup.object({
	jobOrderId: yup.string().required('Job order ID is required'),
	clientId: yup.string().optional(),
	carId: yup.string().optional(),
	assignedMechanicId: yup.string().optional(),
	parts: yup.array().of(jobOrderPartSchema).optional(),
	workRequested: yup.array().of(jobOrderServiceSchema).optional(),
});

// ---------------- UPDATE STATUS ----------------
const updateJobOrderStatusValidator = yup.object({
	jobOrderId: yup.string().required('Job order ID is required'),
	status: yup.string().required('Status is required').oneOf(['pending', 'in_progress', 'completed']),
	updatedBy: yup.string().optional(),
});

module.exports = {
	createJobOrderValidator,
	updateJobOrderValidator,
	updateJobOrderStatusValidator,
};
