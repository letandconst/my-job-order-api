const yup = require('yup');

const serviceTypeSchema = yup.object().shape({
	name: yup.string().required('Service name is required'),
	category: yup.string().required('Category is required'),
	description: yup.string().nullable(),
	isActive: yup.boolean().default(true),
	amount: yup
		.object({
			sedan: yup.number().required(),
			hatchback: yup.number().required(),
			crossover: yup.number().required(),
			suv: yup.number().required(),
			pickup: yup.number().required(),
		})
		.required('Amount per car type is required')
		.test('at-least-one', 'At least one car type amount must be provided', (value) => value && Object.values(value).some((v) => v !== undefined)),
});

const updateServiceTypeSchema = yup.object().shape({
	description: yup.string().nullable(),
	category: yup.string().required('Category is required'),
	isActive: yup.boolean(),
	amount: yup
		.object({
			sedan: yup.number().nullable(),
			hatchback: yup.number().nullable(),
			crossover: yup.number().nullable(),
			suv: yup.number().nullable(),
			pickup: yup.number().nullable(),
		})
		.nullable()
		.notRequired()
		.test('at-least-one-if-provided', 'At least one car type amount must be provided when updating', function (value) {
			// Get the raw input sent in this request
			const input = this.parent.amount;

			// If no amount key in input, skip validation
			if (!input || Object.keys(input).length === 0) return true;

			// Only check keys that are actually provided
			const providedValues = Object.entries(input)
				.filter(([_, val]) => val !== undefined)
				.map(([_, val]) => val);

			return providedValues.some((v) => v !== null);
		}),
});

module.exports = {
	serviceTypeSchema,
	updateServiceTypeSchema,
};
