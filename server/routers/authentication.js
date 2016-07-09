'use strict';
const router = require('express').Router();

router.post('/signin', require('../middlewares/auth').loadUser, require('./../controllers/auth.controller').signin);
router.post('/signup', require('./../controllers/auth.controller').signup);
router.post('/signout', require('./../controllers/auth.controller').signout);

module.exports = router;