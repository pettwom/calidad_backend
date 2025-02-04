const { Router } = require('express');
// const guard = require('express-jwt-permissions')();

const {
    getDepto,
    getMpio,
    getAg,
    getAe,
    getEmp,
    getListado,
    migrarDatos,
    getValidar,
    saveValidar,
    saveAsignar,
    getListadoCuestionario,
    getListadoPregunta
} = require('../controllers/system/validar.controller');

const router = Router();

router.get('/getDeptos', getDepto);
router.get('/getMpio/:depto', getMpio);
router.get('/getAg/:depto/:mpio', getAg);
router.get('/getAe/:depto/:mpio/:ag', getAe);
router.get('/getEmp/:depto/:mpio/:ag/:ae', getEmp);
router.get('/getListado/:depto/:mpio/:ag/:ae', getListado);
router.get('/migrarDatos', migrarDatos);
router.get('/getValidar/:ids', getValidar);
router.post('/saveValidar', saveValidar);
router.post('/saveAsignar', saveAsignar);
router.get('/getListadoCuestionario/:idrep', getListadoCuestionario);
router.get ('/getListadoPregunta/:nropre', getListadoPregunta );

module.exports = router;
