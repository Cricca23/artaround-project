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
const jwt = require('jsonwebtoken'); // Importiamo la libreria per i token
// ... (altri import che avevi già, tipo User)

// ... (tua funzione register qui sopra) ...

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // LOG 1: Vediamo cosa arriva
    console.log("Tentativo di login per:", email);

    const user = await User.findOne({ email });
    
    // LOG 2: Vediamo se trova l'utente
    if (!user) {
      console.log("❌ Utente non trovato nel DB");
      return res.status(401).json({ message: "Credenziali non valide" });
    }
    console.log("✅ Utente trovato:", user.email);

    const isMatch = await user.comparePassword(password);
    
    // LOG 3: Vediamo se la password piace a bcrypt
    console.log("Password combacia?", isMatch);

    if (!isMatch) {
      console.log("❌ Password errata");
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // ... il resto del codice ...

    // 3. Generiamo il Token (Il "Passaporto")
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload: cosa mettiamo nel token
      process.env.JWT_SECRET,            // Segreto: la chiave per chiuderlo
      { expiresIn: '1h' }                // Scadenza: 1 ora
    );

    // 4. Inviamo il token al frontend
    res.status(200).json({
      message: "Login effettuato con successo!",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
};