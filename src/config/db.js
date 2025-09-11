const mongoose = require('mongoose');

const connectDB = async () => {
	const uri = process.env.MONGO_URI;

	if (!uri) {
		console.error('❌ MONGO_URI not set');
		process.exit(1);
	}

	try {
		await mongoose.connect(uri);
		console.log('✅ Connected to the Database');
	} catch (err) {
		console.error('❌ MongoDB connection error:', err.message);

		// Retry after 5 seconds
		setTimeout(connectDB, 5000);
	}
};

// Graceful shutdown
mongoose.connection.on('disconnected', () => {
	console.warn('⚠️ MongoDB disconnected');
});

process.on('SIGINT', async () => {
	await mongoose.connection.close();
	console.log('🔌 MongoDB connection closed due to app termination');
	process.exit(0);
});

module.exports = connectDB;
