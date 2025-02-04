const express = require('express');
const app = express();
const consultaDatos = require('../controllers/system/datos.controller'); // Importa el controlador
// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obtener los datos
app.get('/datos', consultaDatos);