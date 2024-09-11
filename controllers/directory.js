const { response } = require("express");
const {Directory, Usuario, Location} = require('../models');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongoose').Types;
const cloudinary = require('cloudinary').v2;


// obtenerCategoirias - Paginado - total - populate

const ObtenerDirectory = async(req, res= response) => {

    try {
        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, Direct] = await Promise.all([
            Directory.countDocuments(query),
            Directory.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
        ]); 
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total,
                Direct
            }]
        }) 
    
    } catch (error) {
      console.log('ObtenerDirectory error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

       

}

const ObtenerDirectoryByType = async(req, res=response) => {

    try {
    const {id} = req.params;

    if(id =='' || id == null || id == undefined ){
        return res.status(200).json({
            header: [{
                error:'No hay datos para realizar la busqueda',
                code: 404,
            }],
            body:[{}]
        }) 
    }

    const directory = await Directory.find({type:id.toUpperCase()});

    if(directory){
        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                directory
            }]
        }) 
    }else{
        return res.status(200).json({
            header: [{
                error:'La idea no esta registrada',
                code: 400,
            }],
            body:[{}]
        })  
    }
    
    } catch (error) {
      console.log('ObtenerDirectoryByType error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }


}

const ObtenerDirectoryByUser = async(req, res= response) => {

    try {
        console.log(req.usuario._id)
        const query = {
            user: req.usuario._id,
            state: true
        }
        const findDirectoryByUser = await Directory.find(query).populate('user','name')
        
        const countDirectories = await Directory.countDocuments(query)
    
        if(findDirectoryByUser =='' || findDirectoryByUser == null || findDirectoryByUser == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No tienes una idea registrada',
                    code: 404,
                }],
                body:[{}]
            }) 
        }
    
        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total: countDirectories,
                findDirectoryByUser
            }]
        })
    
    } catch (error) {
      console.log('ObtenerDirectoryByUser error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }
   
}

const ObtenerDirectoryById = async(req = request, res = response) => {

    try {
        const {id} = req.params;

        if(id =='' || id == null || id == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No hay datos para realizar la busqueda',
                    code: 404,
                }],
                body:[{}]
            }) 
        }
    
        const directory = await Directory.findById(ObjectId(id));
    
        if(directory){
            return res.status(200).json({
                header: [{
                    error:'NO ERROR',
                    code: 200,
                }],
                body:[{
                    directory
                }]
            }) 
        }else{
            return res.status(200).json({
                header: [{
                    error:'La idea no esta registrada',
                    code: 400,
                }],
                body:[{}]
            })  
        }
    
    } catch (error) {
      console.log('ObtenerDirectoryById error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   
}

const CrearDirectory = async( req, res = response) => {

    try {
        const {name, lat, lng, model, img, numberContact, numberWhatsApp, time, delibery, empres} = req.body;
        const randomId = uuidv4();
        var link;
        var newNumberContact;
        var newNumberWhatsApp;
    
        if(name == '' || name == null || name == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor ingrese el nombre de tu idea`,
                    code: 400,
                }],
                body:[{}]
            })
        };
    
        if(model == '' || model == null || model == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor ingresa si es bien o servicio`,
                    code: 400,
                }],
                body:[{}]
            })
        };

        if(delibery == '' || delibery == null || delibery == undefined){ 
            return res.status(200).json({
                header: [{
                    error:`Por favor ingrese si tiene domicilios`,
                    code: 400,
                }],
                body:[{}]
            })
        };

        if(empres == '' || empres == null || empres == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor ingrese el nombre de tu idea`,
                    code: 400,
                }],
                body:[{}]
            })
        };
    
       const directoryDB = await Directory.findOne({randomId:randomId});
    
        if(directoryDB) {
            return res.status(200).json({
                header: [{
                    error:`Error al procesar la solicitud, por favor intenta de nuevo`,
                    code: 400,
                }],
                body:[{}] 
            }) 
        }; 
        if(numberWhatsApp == '' || numberWhatsApp == null || numberWhatsApp == undefined){
            newNumberWhatsApp = false
        }else{
            newNumberWhatsApp = numberWhatsApp
        }
    
        if(numberContact == '' || numberContact == null || numberContact == undefined || numberContact == -1){
    
            const user = await Usuario.findById(ObjectId(req.usuario._id))
            if(user){
                newNumberContact = parseInt(user.phone)
            }else {
                return res.status(200).json({
                    header: [{
                        error:`ERROR DEL SERVIDOR`,
                        code: 500,
                    }],
                    body:[{}]
                })
            }
        }else{
            newNumberContact = parseInt(numberContact)
        }
    
        if(img == '' || img == null || img == undefined){
            var link = process.env.IMGPROFILEDEFAUL
        }else{
            await cloudinary.uploader.upload(img).then(res => {
                link = res.secure_url;
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
        };
    
        
    
        const data = {
            name:name,
            model:model.toUpperCase(),
            user: req.usuario._id,
            lat:lat,
            lng:lng,
            delibery:delibery,
            description: req.body.description,
            numberWhatsApp:newNumberWhatsApp,
            numberContact:newNumberContact,
            adress:req.body.adress,
            img:link,
            randomId: randomId,
            time, 
            empres
        }
    
        const location = new Location({
            randomId: randomId,
            name:name,
            lat:lat, 
            lng:lng,
            delibery:delibery,
            user: req.usuario._id, 
            adress:req.body.adress,
            description:req.body.description,
            img:link,
            model:model.toUpperCase(),
            numberWhatsApp:newNumberWhatsApp,
            numberContact:newNumberContact,
            time, 
            empres
        })
    
        const directory = new Directory(data);
    
        await directory.save();
        await location.save();
        
        await Usuario.findByIdAndUpdate(req.usuario._id, {directory: true})
    
    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'Tu idea fue registrada exitosamente!',
                directory
            }]
        });
    
    } catch (error) {
      console.log('CrearDirectory error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   
}

const actualiarDirectory = async(req, res= response) => {

    try {
    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findById = await Directory.findById(id);

    if(!findById){
        return res.status(200).json({
            header: [{
                error:`No existe la idea a la que intentas actualizar`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(data.name == '' || data.name == null || data.name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la idea`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;

    const directory = await Directory.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La idea se actualizo correctamente',
            directory
        }]
    })
    
    } catch (error) {
      console.log('actualizarDirectory error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const eliminarDirectory = async(req, res= response) => {
    
    try {
    
        const {id} = req.params;

    const findId = await Directory.findById(id)

    const idUser = findId.user._id

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe la idea que quieres borrar`,
                code: 400,
            }],
            body:[{}]
        })
    }
    
    const directoryDelete = await Directory.findByIdAndUpdate(id , {state:false}, {new:true});

    const countDirectories = await Directory.countDocuments({
        user: ObjectId(idUser),
        state:true,
        new:true
    })

    if(countDirectories<1 || countDirectories == 0){
    await Usuario.findByIdAndUpdate(idUser, {directory: false})

    }

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La ida se borro correctamente del directorio',
            directoryDelete
        }]
    })
    
    } catch (error) {
      console.log('template error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }
}



module.exports = { 
    ObtenerDirectory,
    ObtenerDirectoryByUser,
    ObtenerDirectoryById,
    ObtenerDirectoryByType,
    CrearDirectory,
    actualiarDirectory,
    eliminarDirectory
}