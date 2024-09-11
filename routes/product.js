const { Router} = require('express');
const { check } = require('express-validator');
const { 
    obtenerProducts, 
    crearProduct, 
    actualizarProducts, 
    BorrarProducts, 
    obtenerProduct,
    obtenerTodosProductsByID} = require('../controllers/products');
const { existeCategoryById, existeProductById } = require('../helpers/db-validators');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

//obtener todas las categorias - publico

router.get('/', 
    validateJWT,
    obtenerProducts)

// obtener una categoria por id - publico
router.get('/:id', [
    validateJWT,
    //check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeProductById),
    //validateCampos
], obtenerProduct)

//obtener todas las categorias de un id
router.get('/products/:term', [
    validateJWT,
    check('term', 'No es un ID valido').isMongoId(),
    validateCampos
], obtenerTodosProductsByID)
// crear categoria, cualquier persona con un token valido
router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'no es un ID de mongo').isMongoId(),
    check('category').custom(existeCategoryById),
    validateCampos
] , crearProduct)


// actualizar categoria, privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductById),
    validateCampos
], actualizarProducts)


// Borrar categoria, solamente si es admin
router.delete('/:id', [
    validateJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductById),
    validateCampos

], BorrarProducts)


module.exports = router;