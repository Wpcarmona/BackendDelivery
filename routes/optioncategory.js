const { Router} = require('express');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { ObtenerOptioncategory, CrearOptioncategory } = require('../controllers/optioncategory');
const router = Router();

//obtener todas las categorias - publico

    router.get('/:id', [
        validateJWT,
        validateCampos
    ],
    ObtenerOptioncategory); 

    router.post('/',[
        validateJWT,
        validateCampos
    ], CrearOptioncategory)

 module.exports = router;