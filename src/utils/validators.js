const yup = require('yup');

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];

const isImageUrl = (url) => {
	if (!url) return true;
	const lower = url.toLowerCase();
	return IMAGE_EXTENSIONS.some((ext) => lower.endsWith('.' + ext));
};

// ✅ Registration validation schema
const registerSchema = yup.object().shape({
	username: yup.string().min(3, 'Username must be at least 3 characters long').max(30, 'Username cannot be longer than 30 characters').required('Username is required'),
	email: yup.string().email('Invalid email format').required('Email is required'),
	password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
	avatar: yup
		.string()
		.nullable()
		.test('is-image-url', 'Avatar must be a valid image URL', (value) => isImageUrl(value)),
});

// ✅ Login validation schema
const loginSchema = yup.object().shape({
	email: yup.string().email('Invalid email').nullable(),
	username: yup.string().nullable(),
	password: yup.string().required('Password is required'),
});

// ✅ Update Profile validation schema
const updateProfileSchema = yup.object().shape({
	email: yup.string().email('Invalid email'),
	password: yup.string().min(6, 'Password must be at least 6 characters long'),
	avatar: yup
		.string()
		.nullable()
		.test('is-image-url', 'Avatar must be a valid image URL', (value) => isImageUrl(value)),
});

module.exports = {
	registerSchema,
	loginSchema,
	updateProfileSchema,
};
