const express = require('express')
const router = express.Router();
const { 
    getEstadisticas,
    getObservados,
    getAprobados,
    getTransferidos,
    getDataGrafico
    } = require('../controllers/system/home.controller');


router.get('/getEstadisticas', getEstadisticas)
router.get('/getObservados', getObservados)
router.get('/getAprobados', getAprobados)
router.get('/getTransferidos', getTransferidos)
router.get('/getDataGrafico', getDataGrafico)

module.exports = router;