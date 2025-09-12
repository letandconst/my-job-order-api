const yup = require('yup');

const jobOrderPartSchema = yup.object({
	partId: yup.string().required('Part ID is required'),
	quantity: yup.number().required('Quantity is required').integer('Quantity must be an integer').min(1, 'Quantity must be at least 1'),
});

const jobOrderServiceSchema = yup.object({
	serviceId: yup.string().required('Service ID is required'),
});

const createJobOrderValidator = yup.object({
	customerName: yup.string().required('Customer name is required'),
	address: yup.string().required('Address is required'),
	carModel: yup.string().required('Car model is required'),
	plateNumber: yup.string().required('Plate number is required'),
	mobileNumber: yup
		.string()
		.required('Mobile number is required')
		.matches(/^[0-9]{10,15}$/, 'Mobile number must be valid'),
	assignedMechanicId: yup.string().required('Assigned mechanic is required'),
	parts: yup.array().of(jobOrderPartSchema).optional(),
	workRequested: yup.array().of(jobOrderServiceSchema).optional(),
});

const updateJobOrderValidator = yup.object({
	jobOrderId: yup.string().required('Job order ID is required'),
	customerName: yup.string().optional(),
	address: yup.string().optional(),
	carModel: yup.string().optional(),
	plateNumber: yup.string().optional(),
	mobileNumber: yup
		.string()
		.matches(/^[0-9]{10,15}$/, 'Mobile number must be valid')
		.optional(),
	assignedMechanicId: yup.string().optional(),
	parts: yup.array().of(jobOrderPartSchema).optional(),
	workRequested: yup.array().of(jobOrderServiceSchema).optional(),
});

const updateJobOrderStatusValidator = yup.object({
	jobOrderId: yup.string().required('Job order ID is required'),
	status: yup.string().oneOf(['pending', 'in_progress', 'completed']).required('Status is required'),
});

module.exports = {
	createJobOrderValidator,
	updateJobOrderValidator,
	updateJobOrderStatusValidator,
};
