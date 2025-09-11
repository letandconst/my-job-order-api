const yup = require('yup');
const { isImageUrl, isPhoneNumber } = require('../utils/validators');

const mechanicSchema = yup.object().shape({
	name: yup.string().required('Full name is required'),
	address: yup.string().required('Address is required'),
	phoneNumber: yup
		.string()
		.required('Phone number is required')
		.test('is-phone-number', 'Invalid phone number format', (value) => isPhoneNumber(value)),
	birthday: yup.date().required('Birthday is required'),
	emergencyContactName: yup.string().required('Emergency contact name is required'),
	emergencyContactPhone: yup
		.string()
		.required('Emergency contact phone is required')
		.test('is-phone-number', 'Invalid phone number format', (value) => isPhoneNumber(value)),
	bio: yup.string().nullable(),
	avatar: yup
		.string()
		.nullable()
		.test('is-image-url', 'Avatar must be a valid image URL', (value) => !value || isImageUrl(value)),
	specialties: yup.array().of(yup.string()).nullable(),
	dateJoined: yup.date().nullable(),
});

const updateMechanicSchema = yup.object().shape({
	address: yup.string(),
	phoneNumber: yup.string().test('is-phone-number', 'Invalid phone number format', (value) => !value || isPhoneNumber(value)),
	emergencyContactName: yup.string(),
	emergencyContactPhone: yup.string().test('is-phone-number', 'Invalid phone number format', (value) => !value || isPhoneNumber(value)),
	bio: yup.string().nullable(),
	avatar: yup
		.string()
		.nullable()
		.test('is-image-url', 'Avatar must be a valid image URL', (value) => !value || isImageUrl(value)),
	specialties: yup.array().of(yup.string()).nullable(),
	dateJoined: yup.date().nullable(),
});

module.exports = { mechanicSchema, updateMechanicSchema };
