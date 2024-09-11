const jwt = require('jsonwebtoken')

const generarJWT = ( uid = '' ) => {


    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload,process.env.SECRETORPRIVATEKEY, {
            expiresIn: '7d' //si quieres que expire la conexion
        }, (err, token) => {

            if(err){
                reject('No se pudo generar el Token')
            }else{
                resolve(token);
            }

        })

    });

}


module.exports = {
    generarJWT
}