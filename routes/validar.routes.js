const { Router } = require('express');
// const guard = require('express-jwt-permissions')();

const {
    getDepto,
    getMpio,
    getCom,
    getAg,
    getAe,
    getEmp,
    getListado,
    migrarDatos,
    getValidar,
    saveValidar,
    saveAsignar, 
    getListadoCuest,
    getAlertas,
    getListadoCuestionario,
    getListadoPregunta
    // aprobarCuest
} = require('../controllers/system/validar.controller');

const router = Router();

router.get('/getDeptos', getDepto);
router.get('/getMpio/:depto', getMpio);
router.get('/getCom/:depto/:mpio', getCom);
router.get('/getAg/:depto/:mpio/:com', getAg);
router.get('/getAe/:depto/:mpio/:ag', getAe);
router.get('/getEmp/:depto/:mpio/:com/:ag/:ae', getEmp);
router.get('/getListado/:depto/:mpio/:com/:ag/:ae/:emp/:accion', getListado);
router.get('/migrarDatos', migrarDatos);
router.get('/getValidar/:ids', getValidar);
router.post('/save-validar', saveValidar);
router.post('/saveAsignar', saveAsignar);
router.get('/getListadoCuest', getListadoCuest);
router.get('/getAlertas/:id', getAlertas);
router.get('/getListadoCuestionario/:idrep', getListadoCuestionario);
router.get ('/getListadoPregunta/:nropre', getListadoPregunta );
// router.post ('/aprobarCuest', aprobarCuest );

module.exports = router;
