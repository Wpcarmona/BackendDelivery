const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { ObtenerDirectory, CrearDirectory, actualiarDirectory, eliminarDirectory, ObtenerDirectoryByUser, ObtenerDirectoryById, ObtenerDirectoryByType } = require('../controllers/directory');

const router = Router();

//obtener todas las categorias - publico

   /*router.get('/', [
        validateJWT,
        validateCampos
    ],
    ObtenerDirectory); */

    router.get('/type/:id', [
        validateJWT,
    ], ObtenerDirectoryByType)


    router.get('/', [
        validateJWT, 
        validateCampos
    ], ObtenerDirectoryByUser)


    router.get('/idea/:id', [
        validateJWT, 
        check('id', 'No es un ID valido').isMongoId(),
        validateCampos
    ], ObtenerDirectoryById)

    router.post('/',[
        validateJWT,
        validateCampos
    ],CrearDirectory);

    router.put('/:id', [
        validateJWT, 
        check('id', 'No es un ID valido').isMongoId(),
        validateCampos
    ], actualiarDirectory)

    router.delete('/:id', [
        validateJWT,
        check('id', 'No es un ID valido').isMongoId(),
        validateCampos
    ], eliminarDirectory)



module.exports = router;