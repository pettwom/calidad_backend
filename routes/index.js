/* eslint-disable no-unused-vars */
'use strict';

const express = require('express');
const auth = require('express-jwt');
const config = require('../config/auth');
const api = express.Router();

module.exports = function setupApi() {

  api.use('/login', require('../routes/login.routes'));
  api.use('/dashboard', require('../routes/dashboard.routes'));
  api.use('/validar', require('../routes/validar.routes'));
  api.use('/asignar', require('../routes/asignacion.routes'));
  api.use('/transferencia', require('../routes/transferencia.routes'));
  api.use('/home', require('../routes/home.routes'));
  api.use('/variables', require('../routes/variables.routes'));
  api.use('/', require('../routes/log.routes'));

  return api;
};
