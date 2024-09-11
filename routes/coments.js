const {Router} = require('express');
const { validateJWT } = require('../middlewares/validar-jwt');
const { getAllComentsOfUniqueProduct, createComentforProduct } = require('../controllers/ coments');



const router = Router();


router.get('/product/:id',[
    validateJWT
],getAllComentsOfUniqueProduct)


router.post('/product',[
    validateJWT
],createComentforProduct)

module.exports = router;