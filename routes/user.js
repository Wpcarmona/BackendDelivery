const { Router } = require('express');
const { check } = require('express-validator');
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch, 
    usuariosGetById,
    recuperarPasswordUser,
    updatePassWithEmail,
    validateCodeUser,
    updateEmail
} = require('../controllers/user.controller');
const { esRolevalido, existeUsuarioPorId } = require('../helpers/db-validators');


const {validateCampos} = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', validateJWT,usuariosGet);

router.get('/:id', 
    validateJWT,
    usuariosGetById
);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeUsuarioPorId), //si solo se tiene una variable, se entiende por defecto que esa se enviara
    //check('role').custom(esRolevalido),
    validateCampos
],usuariosPut);

router.post('/', [
    //check('name', 'El nombre es obligatorio').not().isEmpty(),
    //check('password', 'El password es obligatorio y mas de 6 letras').isLength({min: 6}),
    //check('phone', 'el numero de telefono debe de contener 10 caracteres').isLength({min:10}),
    //check('email').custom(emailExiste),
    //check('role').custom(esRolevalido),
    //validatePhone,
    check('name'),
    check('email'),
    check('password'),
    check('phone'),
    check('directory'),
    validateCampos
] ,usuariosPost); //si se tienen mas de 3, significa que el del medio es un middlewares

router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeUsuarioPorId), //si solo se tiene una variable, se entiende por defecto que esa se enviara
    validateCampos
],usuariosDelete);

router.post('/resetpassword',recuperarPasswordUser);

router.post('/updatepass',updatePassWithEmail)

router.post('/code',validateCodeUser)

router.post('/updatepassworduser',[
    validateJWT
],updateEmail)

router.patch('/', usuariosPatch);


module.exports = router;
