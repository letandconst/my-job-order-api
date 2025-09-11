const Mechanic = require('../models/Mechanic');
const { mechanicSchema, updateMechanicSchema } = require('../validators/mechanicValidator');

const createMechanic = async (args) => {
	await mechanicSchema.validate(args);

	const existingMechanic = await Mechanic.findOne({
		name: args.name,
		birthday: args.birthday,
	});

	if (existingMechanic) {
		throw new Error('A mechanic with this name and birthday already exists.');
	}

	const mechanic = new Mechanic({
		name: args.name,
		address: args.address,
		phoneNumber: args.phoneNumber,
		birthday: args.birthday,
		emergencyContact: {
			name: args.emergencyContactName,
			phoneNumber: args.emergencyContactPhone,
		},
		bio: args.bio,
		avatar: args.avatar,
		specialties: args.specialties,
		dateJoined: args.dateJoined || Date.now(),
	});

	await mechanic.save();
	return mechanic;
};

const getMechanics = async () => Mechanic.find();

const getMechanicById = async (id) => Mechanic.findById(id);

const updateMechanic = async (id, args) => {
	await updateMechanicSchema.validate(args);

	const mechanic = await Mechanic.findById(id);
	if (!mechanic) return null;

	if ((args.name || args.birthday) && (args.name !== mechanic.name || args.birthday !== mechanic.birthday)) {
		const duplicate = await Mechanic.findOne({
			name: args.name || mechanic.name,
			birthday: args.birthday || mechanic.birthday,
			_id: { $ne: id }, // exclude current mechanic
		});
		if (duplicate) {
			throw new Error('Another mechanic with this name and birthday already exists.');
		}
	}

	const mutableFields = ['name', 'address', 'phoneNumber', 'bio', 'avatar', 'specialties', 'dateJoined'];

	mutableFields.forEach((field) => {
		if (args[field] !== undefined) mechanic[field] = args[field];
	});

	if (args.emergencyContactName !== undefined) mechanic.emergencyContact.name = args.emergencyContactName;
	if (args.emergencyContactPhone !== undefined) mechanic.emergencyContact.phoneNumber = args.emergencyContactPhone;

	await mechanic.save();
	return mechanic;
};

const deleteMechanic = async (id) => {
	const mechanic = await Mechanic.findByIdAndDelete(id);
	return mechanic;
};

module.exports = {
	createMechanic,
	getMechanics,
	getMechanicById,
	updateMechanic,
	deleteMechanic,
};
