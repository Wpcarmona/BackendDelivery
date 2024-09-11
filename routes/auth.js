const { Router} = require('express');
const { check } = require('express-validator');
const { login, googleSignin, generateNewToken } = require('../controllers/auth');
const { validateCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validateCampos
], login);

router.get('/genNewToken',generateNewToken)

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateCampos
], googleSignin);



module.exports = router;