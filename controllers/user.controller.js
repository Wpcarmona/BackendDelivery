const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');
const { ObjectId } = require('mongoose').Types;
const {transporter } = require('../helpers/mailer');
const cloudinary = require('cloudinary').v2;


const usuariosGet = async(req = request, res= response) => {

    try {
        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, users] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query).limit(Number(limit)).skip(Number(desde))
        ]);
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total,
                users
            }]
        })
        
    } catch (error) {
        console.log('usuarios get error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    }
    

    
}

const usuariosGetById = async(req = request, res = response) => {

    const {id} = req.params;

    try {
        
        const usuario = await Usuario.findById({_id:ObjectId(id)})
        if(usuario){
            res.status(200).json({
                header: [{
                    error:'NO ERROR',
                    code: 200,
                }],
                body:[{
                    usuario
                }]
            })        
        }else{
            res.status(200).json({
                header: [{
                    error:'No encontramos al usuario',
                    code: 400,
                }],
                body:[{}]
            })       
        }
    } catch (error) {
        console.log('usuariosGetById error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    }

    
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, email, state, img, ...resto} = req.body;

    

    // TODO validar contra base de datos

    if(password){
         //Encriptar la contra
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    if(img){
        await cloudinary.uploader.upload(img).then(res => {
            resto.img = res.secure_url;
        }, error => {
            if(error.http_code == 400){
            return res.status(200).json({
                header: [{
                    error:`No hay imagen que subir`,
                    code: 400,
                }],
                body:[{}]
            })
        }else{
            return res.status(200).json({
                header: [{
                    error:`error al subir la imagen`,
                    code: 400,
                }],
                body:[{}]
            })
        }
        });
    }

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'Usuario actualizado correctamente',
                user:usuario
            }]
        }) 
    } catch (error) {
        console.log('UsuariosPut error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    }

    
}

const usuariosPost = async (req, res = response) => {

    const {name, email, password, role, phone, directory} = req.body;

    const code = Math.floor(100000 + Math.random() * 900000);
    
    if(name == undefined || name == ""){
        return res.status(200).json({
            header: [{
                error: 'El nombre es obligatorio',
                code: 400
            }],
            body:[{}]
        });
    }

    if(email == undefined || email == ""){
        return res.status(200).json({
            header: [{
                error: 'El correo es obligatorio',
                code: 400
            }],
            body:[{}]
        });
    }

    const emailprocess = email.lastIndexOf('@');
    const domaninEmail = email.slice(emailprocess + 1,  email.length)

    if(domaninEmail != 'gmail.com'){
        return res.status(200).json({
            header: [{
                error: 'El correo debe ser gmail',
                code: 400
            }],
            body:[{}]
        });
    }

    if(password == undefined || password == ""){
        return res.status(200).json({
            header: [{
                error: 'La contraseña es obligatoria',
                code: 400
            }],
            body:[{}]
        });
    }

    if(password.length < 6){
        return res.status(200).json({
            header: [{
                error: 'La contraseña debe contener minimo 6 caracteres',
                code: 400, 
            }],
            body:[{}]
        });
    }

    if(phone == undefined || phone == ""){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El telefono es obligatorio'
            }],
            body:[{}]
        });
    }

    if(phone.length<10){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'el numero de telefono debe contener 10 caracteres'
            }],
            body:[{}]
        });
    }

    try {

    const existeEmail = await Usuario.findOne({ email:email.toUpperCase()});
    const existePhone = await Usuario.findOne({ phone:phone});

    if(existeEmail){
        return res.status(200).json({
            header: [{
                error: 'El correo ya se encuentra registrado',
                code: 400
            }],
            body:[{}]
        });
    }
    
    if(existePhone){
        return res.status(200).json({
            header: [{
                error: 'El numero de telefono ya se encuentra registrado',
                code: 400
            }],
            body:[{}]
        });
    }

    var firstName = name.split(' ')[0];
    const usuario = new Usuario({
        name, 
        email:email.toUpperCase(), 
        password, 
        role, 
        phone, 
        directory, 
        firstName,
        code
    });

    //Encriptar la contra
    const salt = bcryptjs.genSaltSync();
    const token = await generarJWT(usuario.id);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    await transporter.sendMail({
        from: '"DeliveryShop"', // sender address
        to: email, // list of receivers
        subject: "Código de activación", // Subject line
        text: `Hola somos el equipo de DeliveryShop!, este es tu código para validar el usuario: ${code}`
        // plain text body
        //html: "<b>Hello world?</b>", // html body
        
        });

    res.json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El usuario fue creado correctamente, recuerda que debes validar tu usuario con el código que te mandamos al correo registrado'
        }]
    }); 
    } catch (error) {

        console.log('error al registrar =>' + error)
        return res.json({
            header: [{
                error:'Tuvimos un error al registrar, por favor intentalo mas tarde',
                code: 500,
            }],
            body:[{}]
        }); 
    }
}

const validateCodeUser = async(req, res= response) => {

    const {code} = req.body;

    try {

    const findCode = await Usuario.findOne({code:code});

    if(!findCode){
        return res.status(200).json({
            header: [{
                error: 'Codigo incorrecto, intentalo nuevamente',
                code: 400
            }],
            body:[{}]
            
        }) 
    }
 
    const idUser = findCode._id
    const token = await generarJWT(idUser);

    const updateUser = await Usuario.findByIdAndUpdate(idUser,{state:true, code:0},{new:true})

    return res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200
        }],
        body:[{
            msg: 'Usuario validado exitosamente',
            toke:token,
            user:updateUser
        }]
        
    })
        
    } catch (error) {
        console.log('validateCodeUser error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    }

}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, {state: false}, {new: true});
        //const usuarioAutenticado = req.usuario;
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                msg:'El usuario fue borrado satisfactoriamente',
                usuario
            }]
        })
    } catch (error) {
        console.log('usuariosDelete error ==> ' + error)
        return res.status(500).json({
            header: [{
                error: 'tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body: [{}]
        })
    } 
  
}

const recuperarPasswordUser = async(req, res=response) => {

   
    const link = 'https://dirvalle-20779.web.app'
    const {email} = req.body;

    if(email == '' || email == null || email == undefined){
        return res.status(200).json({
            header: [{
                ERROR: 'El correo es obligatorio',
                code: 400
            }],
            body:[{}]
        });
    }

    try {
        
    const findEmail = await Usuario.findOne({
        email:email.toUpperCase()
    })

    if(!findEmail){
        return res.status(200).json({
            header: [{
                ERROR: 'No se encontro el correo',
                code: 400
            }],
            body:[{}]
        });
    }

    
        await transporter.sendMail({
            from: '"DeliveryShop"', // sender address
            to: email, // list of receivers
            subject: "Cambio de contraseña", // Subject line
            text: `Hola somos el equipo de DeliveryShop!, vimos que pediste cambiar tu constraseña, para eso utiliza el siguiente link ${link},
            
            si el cambio no lo pediste tu, por favor ignora este correo.`, 
            // plain text body
            //html: "<b>Hello world?</b>", // html body
          
          });
          res.status(200).json({
            header: [{
                ERROR: 'El correo se envio correctamente, recuerda revisar la bandeja de correo no deseado o Spam',
                code: 200
            }],
            body:[{}]
            
        })
    } catch (error) {
        console.log('recuperarPasswordUser error => ' +error)
        res.status(500).json({
            header: [{
                ERROR: 'Lo sentimos hubo un error, intentalo mas tarde',
                code: 500
            }],
            body:[{}]
            
        })
    }

}

const updatePassWithEmail = async(req, res=response)=> {

    const {email, pass} = req.body;


    if(email == '' || email == null || email == undefined){
        return res.status(200).json({
            header: [{
                ERROR: 'El correo es obligatorio',
                Code: 400
            }],
            body:[{}]
        });
    }

    if(pass == '' || pass == null || pass == undefined){
        return res.status(200).json({
            header: [{
                ERROR: 'Por favor ingree la nueva contraseña',
                Code: 400
            }],
            body:[{}]
        });
    }

    const findEmailpass = await Usuario.find({email:email.toUpperCase()})

    if(!findEmailpass){
        return res.status(200).json({
            header: [{
                ERROR: 'No se encontro el correo electronico',
                Code: 400
            }],
            body:[{}]
        });
    }

   const id = findEmailpass[0]._id
       
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(pass, salt);


    try {
    await Usuario.findByIdAndUpdate(id, {password:password}, {new: true}); 

        res.status(200).json({
         header: [{
             error:'NO ERROR',
             code: 200,
         }],
         body:[{
             msg: 'se actualizo la contraseña correctamente',  
         }]
     }) 
    } catch (error) {
        console.log('updatePassWithEmail'+error)
        res.status(500).json({
            header: [{
                error:'Tuvimos un error, intentalo mas tarde',
                code: 200,
            }],
            body:[{}]
        }) 
    }
 
}

const updateEmail = async(req, res=response)=> {
    const {email, newEmail} = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);

    if(email == '' || email == null || email == undefined){
        return res.status(200).json({
            header: [{
                ERROR: 'Por favor ingrese el coreo',
                Code: 400
            }],
            body:[{}]
        });
    }

    if(newEmail == '' || newEmail == null || newEmail == undefined){
        return res.status(200).json({
            header: [{
                ERROR: 'El nuevo correo es obligatorio',
                Code: 400
            }],
            body:[{}]
        });
    }

    const emailprocess = newEmail.lastIndexOf('@');
    const domaninEmail = newEmail.slice(emailprocess + 1,  newEmail.length)

    if(domaninEmail != 'gmail.com'){
        return res.status(200).json({
            header: [{
                error: 'El correo debe ser gmail',
                code: 400
            }],
            body:[{}]
        });
    }

    const findEmail = await Usuario.findOne({email:email.toUpperCase()})

    if(!findEmail){
        res.status(200).json({
            header: [{
                error:'El email ingresado no exite',
                code: 200,
            }],
            body:[{}]
        }) 
    }


    const id = findEmail._id;
    
    try {

       await Usuario.findByIdAndUpdate(id, {email:newEmail.toUpperCase(), state:false, code:code}, {new: true});

        await transporter.sendMail({
            from: '"DeliveryShop"', // sender address
            to: newEmail, // list of receivers
            subject: "Código de activación", // Subject line
            text: `Hola somos el equipo de DeliveryShop!, este es tu código para validar tu usuario: ${code}`
            // plain text body
            //html: "<b>Hello world?</b>", // html body
          
          });

        res.json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: '¡El correo electrónico fue actualizado exitosamente, recuerda que debes validar tu correo con el código que te enviamos!'
            }]
        }); 
    } catch (error) {
        console.log('updateEmail error =>'+ error)
        return res.status(500).json({
            header: [{
                error:'Tuvimos un error, por favor intentalo mas tarde',
                code: 500,
            }],
            body:[{}]
        }); 
    } 
}



const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosGetById,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    recuperarPasswordUser,
    updatePassWithEmail,
    updateEmail,
    validateCodeUser
}