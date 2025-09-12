const yup = require('yup');

const partValidator = yup.object({
	name: yup.string().required('Part name is required'),
	description: yup.string().optional(),
	category: yup.string().required('Category is required'),
	brand: yup.string().required('Brand is required'),
	condition: yup.string().oneOf(['new', 'used']).default('new'),
	unit: yup.string().default('pcs'),
	stock: yup.number().required().min(0),
	reorderLevel: yup.number().min(0).default(0),
	price: yup.number().required().min(0),
	isActive: yup.boolean().default(true),
	supplier: yup.string().optional(),
	images: yup
		.array()
		.of(
			yup.object({
				url: yup.string().url('Invalid image URL').required(),
				alt: yup.string().optional(),
			})
		)
		.optional(),
});

module.exports = partValidator;
