const { Router } = require('express');
const axios = require('axios');
const authMiddleware = require('../middlewares/auth.js');
///host + api/ghibli
const router = Router();
const STUDIO_GHIBLI_API = 'https://ghibliapi.vercel.app/';

// Diccionario de roles y sus endpoints correspondientes
const roleEndpoints = {
    films:      'films',
    people:     'people',
    locations:  'locations',
    species:    'species',
    vehicles:   'vehicles'
};

// Función para obtener datos de la API
const fetchGhibliData = async (endpoint) => {
    console.log(`${STUDIO_GHIBLI_API}/${endpoint}`)
    try {
        const response = await axios.get(`${STUDIO_GHIBLI_API}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener datos de ${endpoint}:`, error.message);
        throw new Error(`No se pudo obtener datos de ${endpoint}`);
    }
};

// Middleware para verificar el rol y permitir acceso al endpoint correcto
const verifyRole = (req, res, next) => {
    const userRole = req.user.role;
    if (!roleEndpoints[userRole]) {
        return res.status(403).json({ msg: 'Acceso denegado. No tienes permiso para esta operación.' });
    }
    req.endpoint = roleEndpoints[userRole];
    next();
};

//ruta dinámica para manejar todas las solicitudes según el rol
router.get('/', authMiddleware, verifyRole, async (req, res) => {
    try {
        const data = await fetchGhibliData(req.endpoint);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;