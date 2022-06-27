// on importe le module express
const express = require('express');
// on importe multer
const multer = require('../middleware/multer-config');
// on cree notre router
const router = express.Router();
// on importe notre middelware
const auth = require('../middleware/auth');
// on importe nos controllers
const sauceCtrl = require('../controllers/sauces');
// on cree les routes de notre api qui se servent de nos controllers
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, sauceCtrl.liking);
// on exporte nos routers
module.exports = router;