const cloudinary = require('../config/cloudinary');

// General upload service
const uploadImage = (file, folder = 'uploads') => {
	return new Promise(async (resolve, reject) => {
		try {
			const { createReadStream, mimetype, filename } = await file;

			// ✅ Check that file is an image
			if (!mimetype.startsWith('image/')) {
				return reject(new Error('Only image files are allowed (jpg, png, etc.)'));
			}

			const uploadStream = cloudinary.uploader.upload_stream({ folder, public_id: filename.split('.')[0] }, (error, result) => {
				if (error) return reject(error);
				resolve(result);
			});

			createReadStream().pipe(uploadStream);
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = { uploadImage };
