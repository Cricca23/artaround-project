const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Cerchiamo il token nell'header della richiesta
  const token = req.header('Authorization');

  // Se non c'è il token, blocchiamo tutto
  if (!token) {
    return res.status(401).json({ message: "Accesso negato. Manca il token." });
  }

  try {
    // 2. Puliamo il token (spesso arriva come "Bearer <token>")
    // Se usi Postman "Bearer Token", lui aggiunge "Bearer " davanti. Lo togliamo se c'è.
    const cleanToken = token.replace('Bearer ', '');

    // 3. Verifichiamo se il token è valido usando la nostra chiave segreta
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // 4. Se è valido, aggiungiamo i dati dell'utente alla richiesta
    req.user = verified;
    
    // 5. Lasciamo passare la richiesta al prossimo step
    next(); 

  } catch (error) {
    res.status(400).json({ message: "Token non valido." });
  }
};