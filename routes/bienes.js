const { Router} = require('express');
const { check } = require('express-validator');
const { obtenerBienes, crearBien, ActualizarBien, borrarBien, obtenerBienesPorTipo, obtenerBienesPorName } = require('../controllers/bienes');
const { uploadFile } = require('../helpers');
const { validatefileUpload } = require('../middlewares');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const router = Router();

//obtener todas las bienes - publico

    router.get('/', 
    validateJWT,
    obtenerBienes);

    //buscar bienes por tipo
    router.post('/type',[
        validateJWT,
        validateCampos
    ] , obtenerBienesPorTipo);

    //buscar bienes por nombre
    router.post('/name',[
        validateJWT,
        validateCampos
    ] , obtenerBienesPorName);

    //Creaar Category

    router.post('/:id',[
        validateJWT,
        check('id', 'No es un ID valido').isMongoId(),
        validateCampos
    ] , crearBien);

    // actualizar bienes, privado - cualquier persona con un token valido
    router.put('/:uid/:id', [
    validateJWT, 
    check('uid', 'No es un ID valido').isMongoId(),
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
    ], ActualizarBien)
 

// Borrar categoria, solamente si es admin
    router.delete('/:uid/:id', [
    validateJWT,
    check('uid', 'No es un ID valido').isMongoId(),
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
    ], borrarBien)


module.exports = router;