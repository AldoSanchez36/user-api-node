const mongoose = require('mongoose');

// Configuración global para evitar advertencias futuras
mongoose.set('strictQuery', true);

const dbConnection = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("No se encontró la variable de entorno MONGODB_URI.");
        }

        // Conectar a MongoDB con opciones recomendadas
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Conexión a MongoDB establecida.");

        // Eventos de monitoreo
        mongoose.connection.on("open", () => {
            console.log("MongoDB está activo y en funcionamiento.");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Error en la conexión a MongoDB:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Se ha desconectado de MongoDB.");
        });

    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1); // Cerrar el servidor en caso de error crítico
    }
};

module.exports = { dbConnection };