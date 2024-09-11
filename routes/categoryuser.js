const { Router} = require('express');
const { check } = require('express-validator');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { 
    obtenerTodasCategoriesNameByUserID, 
    crearCategoryname, 
    actualizarCategoryName, 
    borrarCategoryName, 
    obtenerCategoriasPorIdeaID } = require('../controllers/categoryuser');

const router = Router();

router.get('/', [
    validateJWT,
    //check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    //validateCampos
], obtenerTodasCategoriesNameByUserID);

router.get('/:id', [
    validateJWT,
    //check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    //validateCampos
    
], obtenerCategoriasPorIdeaID);


router.post('/',[
    validateJWT,
    //check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateCampos
] , crearCategoryname)


// actualizar categoria, privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT, 
    check('id', 'No es un ID valido').isMongoId(),
    //check('name','El nombre debe ser obligatorio').not().isEmpty(),
    //check('id').custom(existeCategoryById),
    validateCampos
], actualizarCategoryName)


// Borrar categoria, solamente si es admin
router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    //check('id').custom(existeCategoryById),
    validateCampos

], borrarCategoryName)


module.exports = router;