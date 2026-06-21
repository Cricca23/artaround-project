const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API per la gestione delle Opere d'arte
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Ottieni tutte le opere
 *     description: Restituisce l'elenco completo di tutti gli item.
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista di opere ottenuta.
 *   post:
 *     summary: Crea una nuova opera
 *     description: Salva un'opera nel database. Richiede Token JWT.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "La Gioconda"
 *               description:
 *                 type: string
 *                 example: "Dipinto di Leonardo da Vinci"
 *     responses:
 *       201:
 *         description: Opera salvata con successo.
 *       401:
 *         description: Non autorizzato.
 */
router.post('/', authMiddleware, itemController.createItem);
router.get('/', itemController.getItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Ottieni una singola opera per ID
 *     description: Cerca e restituisce un'opera specifica dal database tramite il suo ID.
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID dell'opera generato da MongoDB
 *     responses:
 *       200:
 *         description: Opera trovata.
 *       404:
 *         description: Opera non trovata.
 */
router.get('/:id', itemController.getItemById);

module.exports = router;