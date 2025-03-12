const express = require('express')
const router = express.Router();
const { 
    getEstadisticas
    } = require('../controllers/system/home.controller');


router.get('/getEstadisticas', getEstadisticas)

module.exports = router;