// Rutas de usuario y autenticacion
// host + /api/auth
const { Router } = require('express');
const { check } = require('express-validator');
const { CrearUsuario, CrearUsuarioAdmin, LoginUsuario } = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// Rutas de autenticación
router.post(
    '/register',
    [
        check('name', 'El nombre de usuario es obligatorio').not().isEmpty(),
        check('email', 'El correo debe ser válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    ],
    CrearUsuario
);

router.post(
    '/register/admin',
    authMiddleware,
    [
        check('name', 'El nombre de usuario es obligatorio').not().isEmpty(),
        check('email', 'El correo debe ser válido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    ],
    CrearUsuarioAdmin
);

router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    ],
    LoginUsuario
);


module.exports = router;