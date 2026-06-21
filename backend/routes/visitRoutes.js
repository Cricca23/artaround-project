const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORT CORRETTO

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: API per la gestione delle Visite Guidate nel Marketplace
 */

/**
 * @swagger
 * /api/visits:
 *   get:
 *     summary: Ottieni tutte le visite
 *     description: Restituisce l'elenco completo di tutte le visite salvate nel database (Marketplace).
 *     tags: [Visits]
 *     responses:
 *       200:
 *         description: Lista di visite ottenuta con successo.
 *       500:
 *         description: Errore interno del server.
 */
router.get('/', visitController.getAllVisits);

/**
 * @swagger
 * /api/visits:
 *   post:
 *     summary: Crea una nuova visita guidata
 *     description: Salva una nuova visita nel database. Richiede autenticazione tramite Token JWT.
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mnemonicName
 *               - generalLogistics
 *             properties:
 *               mnemonicName:
 *                 type: string
 *                 example: "Fenice rossa"
 *               generalLogistics:
 *                 type: string
 *                 example: "L'entrata è da via Ernerio 24"
 *     responses:
 *       201:
 *         description: Visita salvata con successo nel Database.
 *       401:
 *         description: Accesso negato (Token mancante o non valido).
 *       500:
 *         description: Errore nel salvataggio.
 */
router.post('/', authMiddleware, visitController.createVisit); 

module.exports = router;