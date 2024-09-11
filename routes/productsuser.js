const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { 
    obtenerTodasProductByUserID, 
    crearProductUser, 
    actualizarProductUser, 
    borrarProductUser, 
    obtenerProductoByIdCategory, 
    obtenerProductById, 
    findProductsByName, 
    obtenerTodosLosProductosByUserID,
    getProductByStars} = require('../controllers/productsuser');

const router = Router();

router.get('/', [
    validateJWT,
    //check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    //validateCampos
], obtenerTodasProductByUserID);

router.get('/shop/:id',[
    validateJWT
], obtenerTodosLosProductosByUserID)

router.get('/:id',[
    validateJWT
], obtenerProductoByIdCategory)

router.get('/product/:id',[
    validateJWT
], obtenerProductById)

router.get('/product/shop/bestPoint',[
    validateJWT
], getProductByStars)

router.post('/',[
    validateJWT,
    //check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateCampos
] , crearProductUser)
 
router.post('/findByName',[
    validateJWT,
    //check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateCampos
] , findProductsByName)


// actualizar categoria, privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    //check('name','El nombre debe ser obligatorio').not().isEmpty(),
    //check('id').custom(existeCategoryById),
    validateCampos
], actualizarProductUser)


// Borrar categoria, solamente si es admin
router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    validateCampos

], borrarProductUser)




module.exports = router;