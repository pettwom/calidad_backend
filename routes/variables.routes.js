const { Router } = require('express');
// const guard = require('express-jwt-permissions')();

const {
    getLista,
    getNumPreg,
    getDepto,
    getMpio,
    getRubro,
    getEditar,
    deleteValidacion,
    saveValidacion
} = require('../controllers/system/variables.controller');

const router = Router();

router.get('/getLista', getLista);
router.get('/getNumPreg', getNumPreg);
router.get('/getDepto', getDepto);
router.get('/getMpio/:depto', getMpio);
router.get('/getRubro', getRubro);
router.get('/getEditar/:ids', getEditar);
router.post('/deleteValidacion', deleteValidacion);
router.post('/saveValidacion', saveValidacion);

module.exports = router;
