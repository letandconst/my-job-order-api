const Mechanic = require('../models/Mechanic');
const { mechanicSchema, updateMechanicSchema } = require('../validators/mechanicValidator');

const createMechanic = async (input) => {
	try {
		await mechanicSchema.validate(input, { abortEarly: false });

		const existingMechanic = await Mechanic.findOne({
			name: input.name,
			birthday: input.birthday,
		});

		if (existingMechanic) {
			throw new Error('A mechanic with these details already exists.');
		}

		const mechanic = await Mechanic.create({
			name: input.name,
			address: input.address,
			phoneNumber: input.phoneNumber,
			birthday: input.birthday,
			emergencyContact: {
				name: input.emergencyContactName,
				phoneNumber: input.emergencyContactPhone,
			},
			bio: input.bio,
			avatar: input.avatar,
			specialties: input.specialties,
			dateJoined: input.dateJoined || Date.now(),
		});

		return mechanic;
	} catch (err) {
		throw new Error(err.message || 'Failed to create mechanic');
	}
};

const getMechanics = async () => {
	try {
		return await Mechanic.find();
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch mechanics');
	}
};

const getMechanicById = async (id) => {
	try {
		const mechanic = await Mechanic.findById(id).lean({ virtuals: true });
		if (!mechanic) {
			throw new Error('Mechanic not found');
		}
		return {
			...mechanic,

			dateJoined: mechanic.dateJoined ? new Date(mechanic.dateJoined).toISOString() : null,
			birthday: mechanic.birthday ? new Date(mechanic.birthday).toISOString() : null,
		};
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch mechanic');
	}
};

const updateMechanic = async (input) => {
	try {
		await updateMechanicSchema.validate(input, { abortEarly: false });
		const { id, ...updateData } = input;

		const mechanic = await Mechanic.findById(id);
		if (!mechanic) {
			throw new Error('Mechanic not found');
		}

		// Check for duplicates
		if ((updateData.name || updateData.birthday) && (updateData.name !== mechanic.name || updateData.birthday !== mechanic.birthday)) {
			const duplicate = await Mechanic.findOne({
				name: updateData.name || mechanic.name,
				birthday: updateData.birthday || mechanic.birthday,
				_id: { $ne: id },
			});
			if (duplicate) {
				throw new Error('Another mechanic with these details already exists.');
			}
		}

		// Update simple fields
		const mutableFields = ['name', 'address', 'phoneNumber', 'bio', 'avatar', 'specialties', 'dateJoined'];
		mutableFields.forEach((field) => {
			if (updateData[field] !== undefined) {
				mechanic[field] = updateData[field];
			}
		});

		// Update nested emergency contact
		if (updateData.emergencyContactName !== undefined) {
			mechanic.emergencyContact.name = updateData.emergencyContactName;
		}
		if (updateData.emergencyContactPhone !== undefined) {
			mechanic.emergencyContact.phoneNumber = updateData.emergencyContactPhone;
		}

		await mechanic.save();
		return mechanic;
	} catch (err) {
		throw new Error(err.message || 'Failed to update mechanic');
	}
};

const deleteMechanic = async (id) => {
	try {
		const mechanic = await Mechanic.findByIdAndDelete(id);
		if (!mechanic) {
			throw new Error('Mechanic not found');
		}
		return true;
	} catch (err) {
		throw new Error(err.message || 'Failed to delete mechanic');
	}
};

module.exports = {
	createMechanic,
	getMechanics,
	getMechanicById,
	updateMechanic,
	deleteMechanic,
};
