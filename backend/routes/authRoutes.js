const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotta PROTETTA: Solo chi ha il token può vederla
router.get('/profile', authMiddleware, (req, res) => {
  // Se siamo qui, il middleware ha già confermato che l'utente è valido!
  // req.user contiene i dati che avevamo messo nel token (id e role)
  res.json({ 
    message: "Benvenuto nell'area riservata!", 
    user: req.user 
  });
});

module.exports = router;