const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ✅ CORRETTO: Passiamo il riferimento alla funzione
router.post('/register', authController.register);

// ❌ ERRORE DA EVITARE: Non mettere le parentesi () qui sotto!
// router.post('/register', authController.register()); 

module.exports = router;