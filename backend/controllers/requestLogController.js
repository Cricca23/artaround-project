// Lo studente clicca "dimmi di più" → deve essere salvato un log

const RequestLog = require('../models/RequestLog');

exports.createLog = async(req, res) => {
    try {
        const newLog = new RequestLog({
            userID: req.user.id,     // dal token JWT - non e' in req.body
            itemID: req.body.itemID, //Questo arriva dal frontend
            tipoReq: req.body.tipoReq
        }); 
        await newLog.save();
        res.status(201).json(newLog);
    } catch(error){
      res.status(400).json({message: "Errore nella richiesta", error});
    }
};

// L'insegnante vuole vedere : 1. Chi si e' connesso alla visita
// 2. Quali studenti hanno cliccato 'dimmi di piu' e su quale opera
exports.readLog = async(req, res) => {
    try{
        const allLog = await RequestLog.find(); // Costante in cui inseriamo il risultato della ricerca nel database
        res.status(200).json(allLog);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero degli studenti collegati", error });
    }
};