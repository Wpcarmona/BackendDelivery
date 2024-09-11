const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email: email.toUpperCase() });
        if (!usuario) {
            return res.status(200).json({
                header: [{
                    code: 400,
                    error: 'El correo o contraseña son incorrectos'
                }],
                body: [{}]
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.state) {
            return res.status(200).json({
                header: [{
                    code: 400,
                    error: 'Esta cuenta fue eliminada'
                }],
                body: [{}]
            });
        }

        // Verificar el password
        const validatePassword = bcryptjs.compareSync(password, usuario.password);
        if (!validatePassword) {
            return res.status(200).json({
                header: [{
                    code: 400,
                    error: 'El correo o contraseña son incorrectos'
                }],
                body: [{}]
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        // Establecer cookie segura con HttpOnly y Secure
        res.cookie('token', token, {
            httpOnly: true, // La cookie no será accesible a través de JS del cliente
            secure: true,   // Solo se envía en HTTPS
            sameSite: 'Strict', // Evita el envío de la cookie en solicitudes de terceros (protege contra CSRF)
            maxAge: 14 * 24 * 60 * 60 * 1000, // La cookie expira en 2 seamanas (14 dias)
        });

        // Retornar respuesta sin token en el cuerpo
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
                token
            }],
            body: [
                usuario
            ]
        });

    } catch (error) {
        console.log('login error ==> ' + error);
        return res.status(500).json({
            header: [{
                error: 'Tuvimos un error, por favor inténtalo más tarde',
                code: 500,
            }],
            body: [{}]
        });
    }
};


const generateNewToken = async(req, res= response) => {
    const {id} = req.query;

    if(!id){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'el id es necesario'
            }],
            body:[{}]
        });
    }

    try {
        const token = await generarJWT(id);

        res.cookie('token', token, {
            httpOnly: true, // La cookie no será accesible a través de JS del cliente
            secure: true,   // Solo se envía en HTTPS
            sameSite: 'Strict', // Evita el envío de la cookie en solicitudes de terceros (protege contra CSRF)
            maxAge: 14 * 24 * 60 * 60 * 1000, // La cookie expira en 1 día (24 horas)
        });

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body: [{
                token
            }]
        })
    } catch (error) {
        console.log('newToken error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    }
}

const googleSignin = async(req, res = response) => {

    const {id_token} = req.body;

    const {email, name, img} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({email});

    if(!usuario){
        //crear el usuario 

        const data = {
            name,
            email,
            password: '',
            img,
            google: true

        };
        usuario = new Usuario(data);
        await usuario.save();
    }

    //si el usuario en DB
    if(!usuario.status){
        return res.status(200).json({
            header: [{
                error: 'hable con un administrador, usuario bloqueado',
                code: 401,
                token,
            }],
            body: [{}]
        })
    }


    //generar JWT

    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    })


    try {
        
        res.status(200).json({

            header: [{
                code: 200,
                error: 'NO ERROR'
            }],
            body: [{
                msg: 'todo ok'
            }]
            
        })
    
    } catch (error) {
        res.status(200).json({
            header: [{
                code: 400,
                error: 'Token de google no es reconocido',
            }],
            body: [{}]
        })
    }
    

   
}

module.exports = {
    login,
    googleSignin,
    generateNewToken
}