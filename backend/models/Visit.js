// backend/models/Visit.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    // Nome mnemonico facile (es. "Fenice rossa")
    mnemonicName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Indicazioni logistiche generali ("l'entrata è da via Garibaldi 2...")
    generalLogistics: {
        type: String,
        required: true
    },
    // La sequenza della visita
    steps: [{
        // Molteplici item per lo stesso oggetto (lunghezze e toni diversi)
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        // Logistica per passare da questo step al successivo ("proseguire a sinistra...")
        navigationLogistics: {
            type: String,
            default: ""
        }
    }],
    // Quiz finale a risposta multipla
    quizzes: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }], // Array di risposte possibili
        correctOptionIndex: { type: Number, required: true } // L'indice (0, 1, 2...) della risposta esatta
    }],
    // Riferimento al docente che ha creato la visita
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);