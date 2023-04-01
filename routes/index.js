var express = require('express');
var router = express.Router();
const controller = require('../controller/index');

// ================== HOME PAGE ==================

router.get('/', controller.get);

router.post('/', controller.post);

// ================== Register PAGE ==================
router.get('/register',controller.getRegister);

router.post('/register',controller.postRegister);




module.exports = router;
