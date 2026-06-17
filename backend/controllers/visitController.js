// backend/controllers/visitController.js
const Visit = require('../models/Visit');

// Crea una nuova visita
exports.createVisit = async (req, res) => {
    try {
        const { mnemonicName, generalLogistics, steps, quizzes } = req.body;

        // Verifica campi obbligatori di base
        if (!mnemonicName || !generalLogistics || !steps || steps.length === 0) {
            return res.status(400).json({ message: "Nome mnemonico, logistiche generali e almeno uno step sono obbligatori." });
        }

        const newVisit = new Visit({
            mnemonicName,
            generalLogistics,
            steps,
            quizzes,
            author: req.user.id // Preso dal middleware di autenticazione JWT
        });

        const savedVisit = await newVisit.save();
        res.status(201).json({ message: "Visita creata con successo", visit: savedVisit });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Il nome mnemonico esiste già. Scegline un altro." });
        }
        res.status(500).json({ message: "Errore nel salvataggio della visita", error: error.message });
    }
};

// Recupera tutte le visite
exports.getAllVisits = async (req, res) => {
    try {
        // Popoliamo gli item e l'autore per avere i dati completi
        const visits = await Visit.find()
            .populate('author', 'name email')
            .populate('steps.items');
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero delle visite", error: error.message });
    }
};