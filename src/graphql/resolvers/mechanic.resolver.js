const { createMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic } = require('../../services/mechanic.service');

const mechanicResolvers = {
	Query: {
		mechanics: async () => {
			try {
				const mechanics = await getMechanics();
				return { success: true, message: 'Mechanics retrieved successfully', mechanics };
			} catch (err) {
				return { success: false, message: err.message, mechanics: [] };
			}
		},
		mechanic: async (_, { id }) => {
			try {
				const mechanic = await getMechanicById(id);
				if (!mechanic) return { success: false, message: 'Mechanic not found', mechanic: null };
				return { success: true, message: 'Mechanic retrieved successfully', mechanic };
			} catch (err) {
				return { success: false, message: err.message, mechanic: null };
			}
		},
	},
	Mutation: {
		createMechanic: async (_, { input }) => {
			try {
				const mechanic = await createMechanic(input);
				return { success: true, message: 'Mechanic created successfully', mechanic };
			} catch (err) {
				return { success: false, message: err.message, mechanic: null };
			}
		},
		updateMechanic: async (_, { id, ...args }) => {
			try {
				const mechanic = await updateMechanic(id, args);
				if (!mechanic) return { success: false, message: 'Mechanic not found', mechanic: null };
				return { success: true, message: 'Mechanic updated successfully', mechanic };
			} catch (err) {
				return { success: false, message: err.message, mechanic: null };
			}
		},
		deleteMechanic: async (_, { id }) => {
			try {
				const mechanic = await deleteMechanic(id);
				if (!mechanic) return { success: false, message: 'Mechanic not found', mechanic: null };
				return { success: true, message: 'Mechanic deleted successfully', mechanic };
			} catch (err) {
				return { success: false, message: err.message, mechanic: null };
			}
		},
	},
};

module.exports = mechanicResolvers;
