const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];

const isImageUrl = (url) => {
	if (!url) return true; // allow null/undefined if optional
	const lower = url.toLowerCase();
	return IMAGE_EXTENSIONS.some((ext) => lower.endsWith('.' + ext));
};

const isPhoneNumber = (value) => {
	if (!value) return false;
	// Allows: +639123456789 OR 09123456789 OR 123-456-7890
	const regex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{6,15}$/;
	return regex.test(value);
};

module.exports = { isImageUrl, isPhoneNumber };
