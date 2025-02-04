const { Router } = require('express');

const {
    getUser, userCuestionario, reasignar
} = require('../controllers/system/asignacion.controller');

const router = Router();

router.get('/getUser', getUser);
router.get('/usuario-cuest/:usu_id', userCuestionario);
router.post('/reasignar', reasignar);


module.exports = router;
 