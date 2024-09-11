const { response } = require("express");
const {CategoryUser} = require('../models');
const { ObjectId } = require('mongoose').Types;

const obtenerCategoriesNameUser = async(req, res= response) => {
    
    try {
    
        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, Categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
            .populate('user','name')
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
                Categories
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


const obtenerUnaCateriesByID = async(req, res= response) => {

    try {
    
    const {id} = req.params; 
    const category = await CategoryUser.findById(id).populate('user', 'name')
    if(!category){
        res.status(200).json({
            header: [{
                error:`no se encontro categoria con ese id`,
                code: 400,
            }],
            body:[{}]
        }) 
    }                     
    res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            category
        }]
    }) 
    
    } catch (error) {
      console.log('obtenerUnaCategoriesByID error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

    

}

const obtenerTodasCategoriesNameByUserID= async(req, res= response) => {

    try {

        const {id} = req.usuario._id
        const query = {state: true}
        const findCategoriesByID = await CategoryUser.find({
            user: ObjectId(id),
            state:true
    
        }).populate('user','name')
        const countCategories = await CategoryUser.countDocuments({
            query,
            user: req.usuario._id,
            state:true
        })
    
        if(findCategoriesByID =='' || findCategoriesByID == null || findCategoriesByID == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No tienes categorias registradas',
                    code: 201,
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
                total: countCategories,
                findCategoriesByID
            }]
        })
    
    
    } catch (error) {
      console.log('obtenerTodasCategoriesNameByUserID error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   
    
}

const obtenerCategoriasPorIdeaID= async(req, res= response) => {

    try {
    
        const {id} = req.params;
        const query = {state: true}
        const findCategoriesByID = await CategoryUser.find({
            ideaId: ObjectId(id),
            state:true
    
        }).populate('user','name')
        const countCategories = await CategoryUser.countDocuments({
            query,
            ideaId: ObjectId(id),
            state:true
        })
    
        if(findCategoriesByID =='' || findCategoriesByID == null || findCategoriesByID == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No tienes categorias registradas',
                    code: 201,
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
                total: countCategories,
                findCategoriesByID
            }]
        })
    
    } catch (error) {
      console.log('obtenerCategoriasPorIdeaID error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

 
    
}

const crearCategoryname = async(req, res= response) => {

    try {
    
        const {name, ideaId, color} = req.body

        if(name == '' || name == null || name == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor ingrese el nombre de la categoria personalizada`,
                    code: 400,
                }],
                body:[{}]
            })
        }
    
        if(ideaId == '' || ideaId == null || ideaId == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor ingrese la idea`,
                    code: 400,
                }],
                body:[{}]
            })
        }

        if(color == '' || color == null || color == undefined){
            return res.status(200).json({
                header: [{
                    error:`Por favor el color`,
                    code: 400,
                }],
                body:[{}]
            })
        }


    
    
        const categoryDB = await CategoryUser.findOne({
            name:name.toUpperCase(),
            user:ObjectId(req.usuario._id),
            ideaId
       });
    
        if(categoryDB) {
            return res.status(200).json({
                header: [{
                    error:`la caterogia ${name}, ya esta registrada`,
                    code: 400,
                }],
                body:[{}]
            })
        }
    
        //Generar la data a guardar
    
        const data = {
            name:name.toUpperCase(),
            user: req.usuario._id,
            ideaId,
            color
        }
    
    
        const category = new CategoryUser(data);
    
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
      console.log('crearCategoryname error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   

}

const actualizarCategoryName = async(req, res = response) => {

    const {id} = req.params;
    const {state, user,...data} = req.body;


    try {
    
        const findId = await CategoryUser.findById(id)

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
    
        const categoryDB = await CategoryUser.findOne({
            name:data.name.toUpperCase(),
            user:ObjectId(req.usuario._id),
            state:true
       });
    
       if(categoryDB){
        return res.status(200).json({
            header: [{
                error:`Ya existe una categoria con el mismo nombre`,
                code: 400,
            }],
            body:[{}]
        })
       }
    
    
        data.name = data.name.toUpperCase();
        data.user = req.user;
    
        const category = await CategoryUser.findByIdAndUpdate(id, data, {new: true});
    
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
      console.log('actualizarCategoryName error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

    
}

const borrarCategoryName =  async(req, res=response) => {

    const {id} = req.params;


    try {
        
    const findId = await CategoryUser.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe esa categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const categoryDelete = await CategoryUser.findByIdAndUpdate(id , {state:false}, {new:true});

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
      console.log('borrarCategoryName error ==> '+error)
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
    crearCategoryname,
    obtenerTodasCategoriesNameByUserID,
    actualizarCategoryName,
    borrarCategoryName,
    obtenerCategoriasPorIdeaID
}