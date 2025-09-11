const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: String },
	},
	{ timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Compare password
userSchema.methods.matchPassword = function (password) {
	return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
