const { response } = require("express");
const {Pcategory} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const obtenerPcategories = async(req, res= response) => {

    try {
    
        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, Pcategories] = await Promise.all([
            Pcategory.countDocuments(query),
            Pcategory.find(query)
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
                Pcategories
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

//Crear categoria comun - solo es valido si el usuario es admin


const crearPcategory = async(req, res= response) => {

    const {name, type} = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(type == '' || type == null || type == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el tipo de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {
        const categoryDB = await Pcategory.findOne({name:name.toUpperCase()});

        if(categoryDB) {
            return res.status(200).json({
                header: [{
                    error:`la caterogia ${name}, ya existe`,
                    code: 400,
                }],
                body:[{}]
            })  
        }
    
        //Generar la data a guardar
    
        const data = {
            name:name.toUpperCase(),
            type: type.toUpperCase(),
            user: req.usuario._id
        }
    
    
        console.log(data)
    
        const category = new Pcategory(data);
    
        //Guardar DB
    
        await category.save(); 
    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'La categoria se creo correctamente',
                category
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


//Actualizar categoria comun - solo es valido si el usuario es admin


const actualizarPcategory = async(req, res = response) => {

    const {id} = req.params;
    const {state, user,...data} = req.body;

   try {
    const findId = await Pcategory.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe esa categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(data.name == '' || data.name == null || data.name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;

    const category = await Pcategory.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se actualizo correctamente',
            category
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


//Borrar categoria comun - solo es valido si el usuario es admin


const borrarPcategory =  async(req, res=response) => {

    const {id} = req.params;

    try {
    
     const findId = await Pcategory.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe esa categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const categoryDelete = await Pcategory.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se borro correctamente',
            categoryDelete
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
    obtenerPcategories,
    crearPcategory,
    actualizarPcategory,
    borrarPcategory
}