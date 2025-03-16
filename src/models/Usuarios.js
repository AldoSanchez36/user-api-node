const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "films", "people", "locations", "species", "vehicles"],
        default: "films",
    },
}, { timestamps: true });


module.exports = model('Usuario', UsuarioSchema);