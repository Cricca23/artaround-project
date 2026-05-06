const mongoose = require('mongoose');

// Tramite la libreria Mongoose creo lo schema che una richiesta, inviata tramite il tasto "dimmi di piu'", deve avere 
// Nella collezione dei log (utile all'insegnate per vedere chi sta attivamente partecipando alla visita) sono salvati solo gli ID 
const RequestSchema = new mongoose.Schema({
    // Tipo di dato: ID univoco che MongoDB assegna ad ogni documento di una collezione
    // ref : ci serrve per dire a moongose a quale collezione appartiene l'ID salvato
    userID :{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemID :{type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
    tipoReq :{type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('RequestLog', RequestSchema);