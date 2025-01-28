const { Router } = require('express');

const {
    getUser,
} = require('../controllers/system/asignacion.controller');

const router = Router();

router.get('/getUser', getUser);


module.exports = router;
