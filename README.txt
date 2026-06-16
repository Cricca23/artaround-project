# Insegnamento di Tecnologie Web
# CdS In Informatica   
# (A.A. 2025-26)

# Progetto ArtAround 18-27

# READ ME DEL PROGETTO ARTAROUND

## Nome del gruppo: 
[INSERIRE NOME DEL GRUPPO QUI]

## Membri del gruppo 

* Nome e cognome: Christian Cani, matricola: 0001171190, mail: christian.cani@studio.unibo.it
* Nome e cognome: [Nome Membro 2], matricola: [Matricola], mail: [Email Membro 2]@studio.unibo.it
* Nome e cognome: Tommaso Zamparelli, matricola: 0001128277, mail: tommaso.zamparelli@studio.unibo.it
* LLM (nome e versione e licenza): Gemini, versione 1.5 Pro, licenza proprietaria Google

## Tipo progetto
18-27

## Data di disponibilità delle applicazioni
[INSERIRE DATA, es. 10 Luglio 2026]

## Locazione del progetto:

* URI del marketplace: [INSERIRE INDIRIZZO WEB QUI]
* URI del navigator: [INSERIRE INDIRIZZO WEB QUI]
* Altri URI rilevanti: Locazione file docker: presente nella cartella root `./docker-compose.yml`

## Organizzazione dei sorgenti
I sorgenti si trovano in una directory `source` all'interno della directory `html`. 
I permessi di accesso ai file sono stati modificati a 755 (directory) e 644 (file).
[DESCRIVERE QUI BREVEMENTE L'ORGANIZZAZIONE INTERNA, es: "La cartella contiene una sottocartella /backend per l'API server-side, /frontend-editor per il pannello Vanilla JS, e /navigator per l'interfaccia utente."]
  
## Tecnologie utilizzate

#### Server-side
Node.js, Express, MongoDB (con libreria Mongoose per modelli Schema.org-compatibili), JSON Web Tokens (JWT) e hashing Bcrypt. Servizio Docker per il database.

#### Applicazione marketplace
Pannello editor sviluppato in HTML, CSS e Vanilla JS, con integrazione di chiamate API asincrone (fetch) per gestione opere e logiche di visualizzazione dinamica.

#### Applicazione navigator
[INSERIRE QUI IL FRAMEWORK USATO DAI TUOI COMPAGNI, es. React, Vue.js, ecc. e le relative librerie NPM]

## Contributo individuale
#### Christian Cani: 
- Backend: Progettazione dell'architettura e configurazione del server (Node.js, Express). Setup di Mongoose per modelli Schema.org-compatibili (`User`, `Item`). Implementazione del sistema di autenticazione basato su JWT e hashing password. Creazione endpoint (ricerca avanzata, protezione rotte in scrittura), sicurezza e validazione dati.
- Frontend Editor: Sviluppo del pannello in Vanilla JS. Integrazione chiamate API per login e salvataggio opere.

#### [Nome Membro 2]: 
[INSERIRE QUI IL CONTRIBUTO DEL MEMBRO 2]

#### Tommaso Zamparelli: 
[INSERIRE QUI IL CONTRIBUTO DI TOMMASO]

#### LLM: 
- Supporto per il refactoring del codice backend per aderenza ai principi REST.
- Setup iniziale dei file di configurazione (es. `.env` example).
- Supporto nel debug della strategia JWT e middleware.
