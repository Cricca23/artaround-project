const User = require('../models/User');

exports.register = async (req, res, next) => { // <--- Aggiungiamo 'next' qui per sicurezza
  try {
    const { name, surname, email, password, role } = req.body;

    // Controllo se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    // Creazione nuovo utente
    const newUser = new User({
      name,
      surname,
      email,
      password,
      role
    });

    // Salvataggio (questo attiva il pre-save hook nel modello User.js)
    await newUser.save();

    res.status(201).json({ message: "Utente creato con successo!" });

  } catch (error) {
    // Se l'errore è "next is not a function", il problema è nel pre-save del MODELLO
    // ma intanto stampiamo l'errore qui per vederlo bene
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};