const { Router } = require('express');
const { check } = require('express-validator');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');
//host + /api/auth
const router = Router();

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Obtener un usuario específico
router.get('/:id', getUserById);

// Middleware para validar si se intenta asignar el rol admin sin ser admin
const checkAdminRoleUpdate = (req, res, next) => {
    if (req.body.role === 'admin' && (!req.user || req.user.role !== 'admin')) {
        return res.status(403).json({ msg: 'Solo un administrador puede asignar el rol de administrador' });
    }
    next();
};

// Actualizar un usuario
router.patch(
    '/:id',
    [
        authMiddleware,
        checkAdminRoleUpdate,
        check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
        check('email', 'El correo debe ser válido').optional().isEmail(),
        check('role', 'Rol inválido').optional().isIn(['admin', 'films', 'people', 'locations', 'species', 'vehicles']),
    ],
    updateUser
);

// Borrar un usuario
router.delete('/:id', deleteUser);

module.exports = router;