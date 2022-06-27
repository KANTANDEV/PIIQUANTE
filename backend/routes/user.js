// on importe express
const express = require('express');
// on cree notre router
const router = express.Router();
// on importe notre controleur
const userCtrl = require('../controllers/user')
// on cree les routes de notre api qui se servent de nos controllers
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login)
// on exporte notre router
module.exports = router;