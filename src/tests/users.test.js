const request = require('supertest');
const app = require('../index'); // Asegúrate de exportar `app` en index.js
const mongoose = require('mongoose');
const Usuarios = require('../models/Usuarios'); // Importar el modelo de usuario

describe('Pruebas de Creación de Usuarios por Categoría', () => {
    const roles = ['films', 'people', 'locations', 'species', 'vehicles'];
    let testUserId;
    let authToken;

    beforeAll(async () => {
        // Eliminar usuarios si ya existen antes de la prueba
        for (const role of roles) {
            await Usuarios.deleteOne({ email: `${role}@example.com` });
        }

        // Crear un usuario de prueba para autenticación y pruebas de obtención
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                confirmPassword: "password123",
                role: "people"
            });
        
        testUserId = res.body.user.id; // Guardamos el ID del usuario creado

        // Hacer login para obtener el token de autenticación
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: "testuser@example.com",
                password: "password123"
            });

        authToken = loginRes.body.token; // Guardamos el token recibido
    });

    roles.forEach((role) => {
        test(` Debe crear un usuario con rol ${role}`, async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: `Usuario ${role}`,
                    email: `${role}@example.com`,
                    password: "password123",
                    confirmPassword: "password123",
                    role: role
                });

            console.log(`Respuesta del servidor para ${role}:`, res.body);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("id");
            expect(res.body.user.role).toBe(role);
        });
    });

    test('*******  Obtener todos los usuarios    ************', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', authToken); // Agregar token de autenticación

        console.log("🔍 Respuesta de obtener todos los usuarios:", res.body);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('*******  Obtener un usuario específico ************ ', async () => {
        
        try {
            const res = await request(app)
                .get(`/api/users/${testUserId}`)
                .set('Authorization', authToken);
    
            console.log("Respuesta de obtener usuario específico:", res.body);
    
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("_id", testUserId);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("email");
            expect(res.body).toHaveProperty("role");
        } catch (error) {
            console.error("Error durante la prueba:", error);
            throw error; // Vuelve a lanzar el error para que la prueba falle
        }
    });

    test('******** Actualizar un usuario específico ************', async () => {
        // Datos para la actualización
        const updatedData = {
            name: 'Test User2',
            email: 'testuser2@example.com',
            role: 'vehicles'
        };
    
        // Intento de actualizar el usuario con rol 'vehicles'
        let res = await request(app)
            .patch(`/api/users/${testUserId}`)
            .set('Authorization', authToken)
            .send(updatedData);
    
        console.log("Respuesta de actualizar usuario a 'vehicles':", res.body);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('role', 'vehicles');
    
        // Intento de actualizar el usuario con rol 'admin'
        updatedData.role = 'admin';
        res = await request(app)
            .patch(`/api/users/${testUserId}`)
            .set('Authorization', authToken)
            .send(updatedData);
    
        console.log("Respuesta de actualizar usuario a 'admin':", res.body);

        // Se espera que falle si no está autenticado como admin
        expect(res.statusCode).toBe(403);
        
        // Verificamos si la respuesta contiene `msg` o `message`
        expect(res.body).toHaveProperty('msg', 'Solo un administrador puede asignar el rol de administrador');
    });

    test('******** Consultar la API de Ghibli ************', async () => {
        const res = await request(app)
            .get('/api/ghibli')
            .set('Authorization', authToken); // Pasamos el token de autenticación
    
        console.log("Respuesta de la API de Ghibli:", res.body);

        expect(res.statusCode).toBe(200); // Código HTTP correcto
        expect(Array.isArray(res.body)).toBe(true); // Verificamos que la respuesta sea un array
        expect(res.body.length).toBeGreaterThan(0); // Validamos que el array tenga datos
    });

    test('******** Borrar un usuario específico ************', async () => {
        // Eliminar el usuario
        let res = await request(app)
            .delete(`/api/users/${testUserId}`)
            .set('Authorization', authToken);
    
        console.log("Respuesta de eliminar usuario:", res.body);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado');
    
        // Verificar que el usuario ya no existe
        res = await request(app)
            .get(`/api/users/${testUserId}`)
            .set('Authorization', authToken);
    
        console.log("Respuesta de obtener usuario después de eliminar:", res.body);
    
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Cerrar conexión a la BD después de los tests
    });
});