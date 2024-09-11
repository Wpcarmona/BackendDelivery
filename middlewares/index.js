const ValidateJWT        = require('../middlewares/validar-jwt');
const ValidateRoles      = require('../middlewares/validar-roles');
const ValidateCampos     = require('../middlewares/validar-campos');
const ValidatefileUpload = require('../middlewares/validar-archivo');


module.exports = {
    ...ValidateCampos,
    ...ValidateJWT,
    ...ValidateRoles,
    ...ValidatefileUpload
}