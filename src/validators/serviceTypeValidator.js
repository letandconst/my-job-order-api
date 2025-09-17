const yup = require('yup');

const amountSchema = yup.object().shape({
	sedan: yup.number().min(0, 'Amount cannot be negative'),
	hatchback: yup.number().min(0, 'Amount cannot be negative'),
	crossover: yup.number().min(0, 'Amount cannot be negative'),
	suv: yup.number().min(0, 'Amount cannot be negative'),
	pickup: yup.number().min(0, 'Amount cannot be negative'),
});

const serviceTypeSchema = yup.object().shape({
	name: yup.string().required('Service name is required'),
	description: yup.string().nullable(),
	category: yup.string().required('Category is required'),
	isActive: yup.boolean().default(true),
	amount: amountSchema.required('Amount per car type is required').test('at-least-one', 'At least one car type amount must be provided', (value) => value && Object.values(value).some((v) => v !== undefined)),
});

const updateServiceTypeSchema = yup.object().shape({
	description: yup.string().nullable(),
	isActive: yup.boolean(),
	amount: amountSchema.test('at-least-one', 'At least one car type amount must be provided when updating', (value) => !value || Object.values(value).some((v) => v !== undefined)),
});

module.exports = {
	serviceTypeSchema,
	updateServiceTypeSchema,
};
