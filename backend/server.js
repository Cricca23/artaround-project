require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORTA LE LIBRERIE PER SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// 2. CONFIGURAZIONE SWAGGER (OPENAPI)
// ==========================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Versione standard richiesta dal prof
        info: {
            title: 'ArtAround API',
            version: '1.0.0',
            description: 'Documentazione interattiva delle API per il backend di ArtAround',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Server di Sviluppo Locale',
            },
        ],
        // Configurazione per far funzionare il login col Token nella pagina web!
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Dice a Swagger dove andare a leggere i commenti per generare la documentazione
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// ==========================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/visits', require('./routes/visitRoutes'));

app.get('/', (req, res) => {
  res.send('ArtAround API server is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});