const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuarios = require('../models/Usuarios');

// Función para generar JWT
const generateJWT = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

// Lista de roles permitidos (excepto admin en registro normal)
const validRoles = ['films', 'people', 'locations', 'species', 'vehicles'];

// Crear usuario (sin permitir admin)
const CrearUsuario = async (req, res = express.response) => {
    const { name, email, password, confirmPassword, role } = req.body;

    try {
        // Validar errores de express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({ ok: false, msg: 'Las contraseñas no coinciden' });
        }

        // Validar formato de email
        if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            return res.status(400).json({ ok: false, msg: 'Formato de correo inválido' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuarios.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ ok: false, msg: 'Este correo ya está registrado' });
        }

        // Prohibir la creación de usuarios con rol "admin"
        if (role === 'admin') {
            return res.status(403).json({ ok: false, msg: 'No tienes permiso para crear un administrador' });
        }

        // Validar rol proporcionado
        const assignedRole = role || 'people';
        if (!validRoles.includes(assignedRole)) {
            return res.status(400).json({ ok: false, msg: 'Rol inválido' });
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Crear usuario
        const usuario = new Usuarios({ name, email, password: hashedPassword, role: assignedRole });

        // Guardar usuario en la base de datos
        await usuario.save();

        // Generar token JWT
        const token = generateJWT(usuario.id, usuario.role);

        res.status(201).json({
            ok: true,
            msg: 'Usuario registrado exitosamente',
            user: { id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role },
            token
        });

    } catch (error) {
        console.error("Error en CrearUsuario:", error);
        res.status(500).json({ ok: false, msg: 'Error interno, contacta al administrador' });
    }
};

// Crear usuario admin (solo administradores pueden hacerlo)
const CrearUsuarioAdmin = async (req, res = express.response) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Verificar que el usuario autenticado es admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, msg: 'Solo un administrador puede crear otro administrador' });
        }

        // Validar errores de express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, errors: errors.array() });
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({ ok: false, msg: 'Las contraseñas no coinciden' });
        }

        // Validar formato de email
        if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            return res.status(400).json({ ok: false, msg: 'Formato de correo inválido' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuarios.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ ok: false, msg: 'Este correo ya está registrado' });
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Crear usuario admin
        const usuario = new Usuarios({ name, email, password: hashedPassword, role: 'admin' });

        // Guardar usuario en la base de datos
        await usuario.save();

        res.status(201).json({
            ok: true,
            msg: 'Administrador creado exitosamente',
            user: { id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role }
        });

    } catch (error) {
        console.error("Error en CrearUsuarioAdmin:", error);
        res.status(500).json({ ok: false, msg: 'Error interno, contacta al administrador' });
    }
};

// Login de usuario
const LoginUsuario = async (req, res = express.response) => {
    const { email, password } = req.body;

    try {
        // Validar formato de email
        if (!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(email)) {
            return res.status(400).json({ ok: false, msg: 'Formato de correo inválido' });
        }

        // Verificar si el usuario existe
        const usuario = await Usuarios.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
        }

        // Comparar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ ok: false, msg: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = generateJWT(usuario.id, usuario.role);

        res.status(200).json({
            ok: true,
            msg: 'Inicio de sesión exitoso',
            user: { id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role },
            token
        });

    } catch (error) {
        console.error('Error en LoginUsuario:', error);
        res.status(500).json({ ok: false, msg: 'Error interno, contacta al administrador' });
    }
};

module.exports = { CrearUsuario, CrearUsuarioAdmin, LoginUsuario };