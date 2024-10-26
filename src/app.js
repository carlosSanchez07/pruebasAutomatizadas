const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json()); // Para poder trabajar con JSON
app.use('/api', routes); // Ruta base /api

module.exports = app;
