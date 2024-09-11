const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { postCreateOffer, getAllSaleOffer, deleteOffer, putUpdateOffer, getAllSaleOfferById } = require('../controllers/sale');
const router = Router();

//obtener todas las categorias - publico

    router.get('/', [
        validateJWT,
        validateCampos
    ],getAllSaleOffer); 

    router.get('/byId', [
        validateJWT,
        validateCampos
    ],getAllSaleOfferById); 

    router.post('/', [
        validateJWT,
    ],postCreateOffer); 

    router.put('/:id', [
        validateJWT,
        validateCampos
    ],putUpdateOffer); 

    router.delete('/:id', [
        validateJWT,
        validateCampos
    ],deleteOffer); 

 module.exports = router;