const { Router} = require('express');
const { check } = require('express-validator');
const { obtenerPcategories, crearPcategory, actualizarPcategory, borrarPcategory } = require('../controllers/pcategory');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

//obtener todas las categorias - publico

    router.get('/', 
    validateJWT,
    obtenerPcategories);

    //Creaar Category

    router.post('/',[
        validateJWT,
        esAdminRole,
        validateCampos
    ] , crearPcategory);

    // actualizar categoria, privado - cualquier persona con un token valido
    router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    esAdminRole,
    validateCampos
    ], actualizarPcategory)


// Borrar categoria, solamente si es admin
    router.delete('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
    ], borrarPcategory)


module.exports = router;