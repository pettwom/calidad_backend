const { Router } = require('express');

const {
    listarCuestionarios, 
    asignarUsuario,
    asigname
} = require('../controllers/system/transferencia.controller');

const router = Router();

router.get('/listarCuestionarios', listarCuestionarios);
router.get('/asignarUsuario', asignarUsuario);
router.post('/asigname', asigname);

module.exports = router;