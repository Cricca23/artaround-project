const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API per Autenticazione e Registrazione
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     description: Crea un nuovo account nel database.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "MarioRossi"
 *               password:
 *                 type: string
 *                 example: "passwordSegreta123"
 *     responses:
 *       201:
 *         description: Utente registrato con successo.
 *       400:
 *         description: Errore nei dati inviati.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il Login
 *     description: Verifica le credenziali e restituisce un Token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "MarioRossi"
 *               password:
 *                 type: string
 *                 example: "passwordSegreta123"
 *     responses:
 *       200:
 *         description: Login effettuato (restituisce il token).
 *       401:
 *         description: Credenziali non valide.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Ottieni profilo utente
 *     description: Rotta protetta per verificare che il token funzioni.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profilo restituito con successo.
 *       401:
 *         description: Token mancante o invalido.
 */
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: "Benvenuto nell'area riservata!", 
    user: req.user 
  });
});

module.exports = router;