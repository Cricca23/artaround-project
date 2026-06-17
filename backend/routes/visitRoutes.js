const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORT CORRETTO

// Creazione visita protetta dal token
router.post('/', authMiddleware, visitController.createVisit); 

// Lettura di tutte le visite
router.get('/', visitController.getAllVisits);

module.exports = router;