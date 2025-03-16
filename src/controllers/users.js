const Usuarios = require('../models/Usuarios');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await Usuarios.find({}, '-password'); // Excluir la contraseña
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuarios' });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await Usuarios.findById(req.params.id, '-password');// Excluir la contraseña
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuario' });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Definir roles válidos
        const validRoles = ['admin', 'films', 'people', 'locations', 'species', 'vehicles'];

        // Validar si el rol es incorrecto
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Rol no válido. Debe ser uno de la lista : ' + validRoles.join(', ') });
        }

        const updatedUser = await Usuarios.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando usuario' });
    }
};

// Borrar un usuario
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await Usuarios.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando usuario' });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };