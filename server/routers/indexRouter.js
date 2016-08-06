'use strict';
/**
 * Created by nickbespalov on 07.08.16.
 */
const router = require('express').Router();

router.get('/', require('./../controllers/index.controller').index);


module.exports = router;