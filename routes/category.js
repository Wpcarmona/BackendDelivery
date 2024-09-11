const { Router, response} = require('express');
const { check } = require('express-validator');
const { crearCategory, actualizarCategory, obtenerCategoriesByID, obtenerCategories, borrarCategory, obtenerUnaCateriesByID, obtenerTodasCategoriesByID } = require('../controllers/categories');
const { existeCategoryById } = require('../helpers/db-validators');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

//obtener todas las categorias - publico

router.get('/', 
    validateJWT,
    obtenerCategories)

// obtener una categoria por id - publico
router.get('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    validateCampos
], obtenerUnaCateriesByID)

//obtener todas las categorias que el usuario registro por id

router.get('/list/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    validateCampos
], obtenerTodasCategoriesByID)

// crear categoria, cualquier persona con un token valido
router.post('/',[
    validateJWT,
    //check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateCampos
] , crearCategory)


// actualizar categoria, privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    //check('name','El nombre debe ser obligatorio').not().isEmpty(),
    //check('id').custom(existeCategoryById),
    validateCampos
], actualizarCategory)


// Borrar categoria, solamente si es admin
router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    validateCampos

], borrarCategory)


module.exports = router;