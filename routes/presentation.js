const { Router} = require('express');
const { check } = require('express-validator');
const { obtenerPresentation, crearPresentation, ActualizarPresentation, borrarPresentation } = require('../controllers/presentation');
const { esAdminRole } = require('../middlewares');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const router = Router();

//obtener todas las bienes - publico

    router.get('/', 
    validateJWT,
    obtenerPresentation);

    //Crear presentation

    router.post('/',[
        validateJWT,
        esAdminRole,
        validateCampos
    ] , crearPresentation);

    // actualizar bienes, privado - cualquier persona con un token valido
    router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    esAdminRole,
    validateCampos
    ], ActualizarPresentation)
 

// Borrar categoria, solamente si es admin
    router.delete('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    esAdminRole,
    validateCampos
    ], borrarPresentation)


module.exports = router;