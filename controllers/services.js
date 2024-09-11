const { response } = require("express");
const {Services} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const obtenerServices = async(req, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, Service] = await Promise.all([
        Services.countDocuments(query),
        Services.find(query)
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
            Service
        }]
    })    

}

const obtenerServicesPorTipo = async(req, res = response) => {

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

    const findServices = await Services.find({
        type: type.toUpperCase()

    }).populate('user','name')
    const query = {type: type.toUpperCase()}
    const countServices = await Services.countDocuments(query)

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total: countServices,
            findServices
        }]
    })

}

const obtenerServicePorName = async(req, res = response) => {

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

    const findServices = await Services.find({
        name: name.toUpperCase()

    }).populate('user','name')
    const query = {name: name.toUpperCase()}
    const countServices = await Services.countDocuments(query)

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total: countServices,
            findServices
        }]
    })

}

//Crear categoria comun - solo es valido si el usuario es admin


const crearService = async(req, res= response) => {

    const {name, description, type} = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    const ServiceDB = await Services.findOne({name:name.toUpperCase()});

    if(ServiceDB) {
        return res.status(200).json({
            header: [{
                error:`El servicio ${name}, ya existe`,
                code: 400,
            }],
            body:[{}]
        })
    }

    //Generar la data a guardar

    const data = {
        name:name.toUpperCase(),
        user: req.usuario._id,
        description,
        type
    }


    console.log(data);

    const Service = new Services(data);

    //Guardar DB

    await Service.save(); 
 
    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se creo correctamente',
            Service
        }]
    })

}


//Actualizar categoria comun - solo es valido si el usuario es admin


const ActualizarService = async(req, res = response) => {

    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findId = await Services.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese servicio`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(data.name == '' || data.name == null || data.name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del servicio`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;

    const Services = await Services.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'Se actualizo correctamente',
            Services
        }]
    })
}
 

//Borrar categoria comun - solo es valido si el usuario es admin


const borrarService =  async(req, res=response) => {

    const {id} = req.params;

    const findId = await Services.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese servicio`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const borrarService = await Services.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El servicio se borro correctamente',
            borrarService
        }]
    })

}


module.exports = {
    obtenerServices,
    obtenerServicesPorTipo,
    obtenerServicePorName,
    crearService,
    ActualizarService,
    borrarService
}