const { Router} = require('express');
const { check } = require('express-validator');
const { cargarFile, actualizarUserImg, ShowImg, actualizarUserImgCloudinary, uploadFileDirectory, imagesConvert } = require('../controllers/uploads');
const { colectionsAccess } = require('../helpers');
const { validatefileUpload } = require('../middlewares');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');

const router = Router();



router.post('/',[
    validateJWT,
    validatefileUpload
    ///check('directory', 'el directorio es necesario').not().isEmpty(),
    //validateCampos,
    ],
    uploadFileDirectory);


router.post('/base64',[
    //validateJWT,
    //validatefileUpload
        ///check('directory', 'el directorio es necesario').not().isEmpty(),
        //validateCampos,
    ],
 imagesConvert);


router.put('/:colection/:id',[
    validateJWT,
    validatefileUpload,
    check('id', 'el id debe ser un id valido').isMongoId(),
    check('colection').custom(c => colectionsAccess(c, ['usuarios', 'products','presentation'])),
    validateCampos
    ],
    //actualizarUserImg
    actualizarUserImgCloudinary);

router.get('/:colection/:id',[
    validateJWT,
    check('id', 'el id debe ser un id valido').isMongoId(),
    check('colection').custom(c => colectionsAccess(c, ['usuarios', 'products', 'presentation'])),
    ], ShowImg)





module.exports = router;