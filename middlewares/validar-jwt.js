const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validateJWT = async(req, res = response, next) => {

    const token = req.header('authorization');
    if(!token){
       return  res.status(200).json({
            header: [{
                error:'No existe una autorizacion valida',
                code: 401,
            }],
            body:[{}]
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);


        if(!usuario){
            return  res.status(200).json({
                header: [{
                    error:'El usuario no existe',
                    code: 401,
                }],
                body:[{}]
            })
        }

        //Verificar si el uid tien estado en true

        if(!usuario.state){
            return res.status(200).json({
                header: [{
                    error:'Autorizacion no valida',
                    code: 401,
                }],
                body:[{}]
            })
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error)
        res.status(200).json({
            header: [{
                error:'Autorizacion no valida',
                code: 401,
            }],
            body:[{}]
        })
    }

}


module.exports = {
    validateJWT

}