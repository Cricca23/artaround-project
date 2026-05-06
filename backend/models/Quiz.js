const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    quest1 : {type: String, required: true}, // Domanda 1
    quest2 : {type: String, required: true},
    quest3: {type: String, required: true},
    quest4 : {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Quiz', quizSchema);