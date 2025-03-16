const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

// Conexión a la base de datos (MongoDB)
const { dbConnection } = require('./DB/config');

// Importar rutas
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const ghibliRoutes = require('./routes/ghibli.js');

const app = express();

// Conectar a la base de datos
dbConnection();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ghibli', ghibliRoutes);

// Manejo de errores no controlados
process.on('unhandledRejection', (error) => {
  console.error('Uncaught Error:', error);
  process.exit(1);
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;