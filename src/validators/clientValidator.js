const yup = require('yup');

const carValidator = yup.object({
	model: yup.string().required('Car model is required'),
	plateNumber: yup.string().required('Plate number is required'),
	year: yup.string().required('Year is required'),
});

const clientValidator = yup.object({
	name: yup.string().required('Client name is required'),
	address: yup.string().optional(),
	birthday: yup.date().required('Birthday is required'),
	mobileNumber: yup
		.string()
		.required('Mobile number is required')
		.matches(/^[0-9+\-()\s]+$/, 'Invalid mobile number format'),
	cars: yup.array().of(carValidator).min(1, 'At least one car is required'),
});

module.exports = clientValidator;
