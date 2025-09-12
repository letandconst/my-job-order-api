const yup = require('yup');

const serviceTypeSchema = yup.object().shape({
	name: yup.string().required('Service name is required'),
	description: yup.string().nullable(),
	category: yup.string().required('Category is required'),
	isActive: yup.boolean().default(true),
	amount: yup.number().required('Amount is required').min(0, 'Amount cannot be negative'),
});

const updateServiceTypeSchema = yup.object().shape({
	name: yup.string(),
	description: yup.string().nullable(),
	category: yup.string(),
	isActive: yup.boolean(),
	amount: yup.number().min(0, 'Amount cannot be negative'),
});

module.exports = {
	serviceTypeSchema,
	updateServiceTypeSchema,
};
