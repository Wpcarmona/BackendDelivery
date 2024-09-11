const { response } = require("express");
const {Bienes, Usuario} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const obtenerBienes = async(req, res= response) => {

    try {

    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, Bien] = await Promise.all([
        Bienes.countDocuments(query),
        Bienes.find(query)
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
            Bien
        }]
    })   
    
    
    } catch (error) {
      console.log('obtenerBienes error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const obtenerBienesPorTipo = async(req, res = response) => {

    const { type } = req.body

    if(type == '' || type == null || type == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor diga que tipo de bien es`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(!type == 'ELECTRODOMESTICOS' || !type == 'ROPA' || !type== 'COMIDA' || !type == 'MUEBLES' || !type == 'TECNOLOGIA'){
        return res.status(200).json({
            header: [{
                error:`el tipo ${type} no es un tipo valido`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {
    
        const findBienes = await Bienes.find({
            type: type.toUpperCase()
    
        }).populate('user','name')
        const query = {type: type.toUpperCase()}
        const countBienes = await Bienes.countDocuments(query)
    
        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total: countBienes,
                findBienes
            }]
        })

    } catch (error) {
      console.log('obtenerBienesPorTipo error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

    

}

const obtenerBienesPorName = async(req, res = response) => {

    const { name } = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por escriba el nombre del bien que busca`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {
    
        const findBienes = await Bienes.find({
            name: name.toUpperCase()
    
        }).populate('user','name')
        const query = {name: name.toUpperCase()}
        const countBienes = await Bienes.countDocuments(query)
    
        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                total: countBienes,
                findBienes
            }]
        })
    
    } catch (error) {
      console.log('obtenerBienesPorName error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

//Crear categoria comun - solo es valido si el usuario es admin


const crearBien = async(req, res= response) => {

    const {name, description, type} = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del bien`,
                code: 400,
            }],
            body:[{}]
        })
    }
    
    if(type == '' || type == null || type == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor diga que tipo de bien es`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {
    
        const data = {
            name:name.toUpperCase(),
            user: req.usuario._id,
            description,
            type:type.toUpperCase(),
        }
    
        const Bien = new Bienes(data);
    
        //Guardar DB
    
        await Bien.save(); 
    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'La categoria se creo correctamente',
                Bien
            }]
        })
    
    } catch (error) {
      console.log('crearBien error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}


//Actualizar categoria comun - solo es valido si el usuario es admin


const ActualizarBien = async(req, res = response) => {

    const {uid, id} = req.params;
    const {state, user,...data} = req.body;

    try {
    const findUid = await Usuario.findById(uid)
    const findId = await Bienes.findById(id);

    if(!findUid ){
        return res.status(200).json({
            header: [{
                error:`No existe el id de usuario`,
                code: 400,
            }],
            body:[{}]
        }) 
    } 

    if(!findId ){
        return res.status(200).json({
            header: [{
                error:`No existe el id del bien`,
                code: 400,
            }],
            body:[{}]
        }) 
    }     

    if(data.name == '' || data.name == null || data.name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del bien a actualizar`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;
    data.type = data.type.toUpperCase();

    
        const Bien = await Bienes.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'Se actualizo correctamente',
                Bien
            }]
        })
    
    } catch (error) {
      console.log('ActualizarBien error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   
}


//Borrar categoria comun - solo es valido si el usuario es admin


const borrarBien =  async(req, res=response) => {

    const {uid, id} = req.params;

    try {
        const findUid = await Usuario.findById(uid)
        const findId = await Bienes.findById(id);
    
        if(!findUid ){
            return res.status(200).json({
                header: [{
                    error:`No existe el id de usuario`,
                    code: 400,
                }],
                body:[{}]
            }) 
        } 
    
        if(!findId ){
            return res.status(200).json({
                header: [{
                    error:`No existe el id del bien`,
                    code: 400,
                }],
                body:[{}]
            }) 
        }     
    
    
        
        const borrarBien = await Bienes.findByIdAndUpdate(id , {state:false}, {new:true});
    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El bien se borro correctamente',
                borrarBien
            }]
        })
    
    } catch (error) {
      console.log('borrarBien error ==> '+error)
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
    obtenerBienes,
    obtenerBienesPorTipo,
    obtenerBienesPorName,
    crearBien,
    ActualizarBien,
    borrarBien
}