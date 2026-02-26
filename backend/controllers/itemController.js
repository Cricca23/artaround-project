const Item = require('../models/Item');

// 1. Crea una nuova opera (Create)
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Errore nella creazione dell'item", error });
  }
};

// 2. Ottieni le opere (con RICERCA opzionale)
exports.getItems = async (req, res) => {
  try {
    // Leggiamo se c'è un parametro ?q=... nell'indirizzo
    const { q } = req.query;

    let filtro = {};
    
    if (q) {
      // Se l'utente sta cercando qualcosa, creiamo un filtro speciale
      // $or: cerca O nel nome O nell'autore
      // $regex: cerca anche solo una parte del testo (es. "Leo" trova "Leonardo")
      // $options: 'i' ignora maiuscole/minuscole
      filtro = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]
      };
    }

    // Chiediamo a MongoDB di trovare solo gli item che rispettano il filtro
    const items = await Item.find(filtro);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli items", error });
  }
};

// 3. Ottieni una singola opera (Read One)
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Opera non trovata" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Errore server", error });
  }
};