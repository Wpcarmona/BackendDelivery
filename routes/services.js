const { Router} = require('express');
const { check } = require('express-validator');
const { obtenerServices, crearService, ActualizarService, borrarService } = require('../controllers/services');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const router = Router();

//obtener todas las categorias - publico

    router.get('/', 
    validateJWT,
    obtenerServices);

    //Creaar Category

    router.post('/',[
        validateJWT,
        validateCampos
    ] , crearService);

    // actualizar categoria, privado - cualquier persona con un token valido
    router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
    ], ActualizarService)


// Borrar categoria, solamente si es admin
    router.delete('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
    ], borrarService)


module.exports = router;