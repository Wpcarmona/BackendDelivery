const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { ObtenerLocation} = require('../controllers/location');
const router = Router();

//obtener todas las categorias - publico

    router.get('/', [
        validateJWT,
        validateCampos
    ],
    ObtenerLocation); 

 module.exports = router;