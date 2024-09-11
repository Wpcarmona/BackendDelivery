const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { getAllItemsuser } = require('../controllers/GetItemIdea');
const router = Router();

//obtener todas las categorias - publico

    router.get('/:id', [
        validateJWT,
        validateCampos
    ],getAllItemsuser); 

 module.exports = router;