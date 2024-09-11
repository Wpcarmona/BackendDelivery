const { response } = require("express");
const {Presentation} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const obtenerPresentation = async(req, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, Present] = await Promise.all([
        Presentation.countDocuments(query),
        Presentation.find(query)
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
            Present
        }]
    })    

}


//Crear categoria comun - solo es valido si el usuario es admin


const crearPresentation = async(req, res= response) => {

    const {name, description, type,property} = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del presentation`,
                code: 400,
            }],
            body:[{}]
        })
    }
    
    if(type == '' || type == null || type == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor diga que tipo de presentation es`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(property == '' || property == null || property == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor diga que tipo es`,
                code: 400,
            }],
            body:[{}]
        })
    }

    //Generar la data a guardar

    const data = {
        name:name.toUpperCase(),
        description,
        type:type.toUpperCase(),
        property:property.toUpperCase()

    } 

    const present = new Presentation(data);

    //Guardar DB

    await present.save(); 

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se creo correctamente',
            present
        }]
    })

}


//Actualizar categoria comun - solo es valido si el usuario es admin


const ActualizarPresentation = async(req, res = response) => {

    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findId = await Presentation.findById(id);

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

    if(data.type == '' || data.type == null || data.type == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor  el tipo`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(property == '' || property == null || property == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor diga que tipo es`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;
    data.type = data.type.toUpperCase();
    data.property = data.property.toUpperCase();

    const present = await Presentation.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'Se actualizo correctamente',
            present
        }]
    })
}


//Borrar categoria comun - solo es valido si el usuario es admin


const borrarPresentation =  async(req, res=response) => {

    const {id} = req.params;

    const findId = await Presentation.findById(id);

    if(!findId ){
        return res.status(200).json({
            header: [{
                error:`No existe el id del bien`,
                code: 400,
            }],
            body:[{}]
        }) 
    }     


    
    const borrarBien = await Presentation.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'la presentation se borro correctamente',
            borrarBien
        }]
    })

}


module.exports = {
    obtenerPresentation,
    crearPresentation,
    ActualizarPresentation,
    borrarPresentation
}