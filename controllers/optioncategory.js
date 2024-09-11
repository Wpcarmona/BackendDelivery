const { response } = require("express");
const {Optioncategory} = require('../models');
const { ObjectId } = require('mongoose').Types;

const ObtenerOptioncategory = async(req, res= response) => {

    const {id} = req.params

    try {
    
        const findOptionCategoryByParams = await Optioncategory.find({
            type:id.toUpperCase()
        })
        
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                category:findOptionCategoryByParams
            }]
        })  
    } catch (error) {
      console.log('ObtenerOptionCategory error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

}

const CrearOptioncategory = async(req, res = response) => {

    const {name, type} = req.body;

    if(name =='' || name == null || name == undefined ){
        return res.status(200).json({
            header: [{
                error:'Por favor ingrese el nombre de las opciones para la categoria',
                code: 404,
            }],
            body:[{}]
        }) 
    }

    if(type =='' || type == null || type == undefined ){
        return res.status(200).json({
            header: [{
                error:'Por favor ingrese el tipo de las opciones para la categoria',
                code: 404,
            }], 
            body:[{}]
        }) 
    }

    try {
        const data = {
            name:name.toUpperCase(),
            type:type.toUpperCase()
        }
    
        const optionCategory = new Optioncategory(data);
    
        await optionCategory.save();
    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'la opcion de categoria fue registrada exitosamente!',
                optionCategory
            }]
        });
    
    } catch (error) {
      console.log('CrearOptioncategory error ==> '+error)
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
    ObtenerOptioncategory,
    CrearOptioncategory,
}