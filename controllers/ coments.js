const { response } = require("express");
const { Usuario, ProductUser, Coments } = require("../models");
const { ObjectId } = require('mongoose').Types;


const getAllComentsOfUniqueProduct = async(req, res=response) => {

    try {
        const {id} = req.params;

        var resp = [];
    
        const findId = await Coments.find({
            idProduct:id,
            state:true
        })

    
        if(!findId){
            return res.status(200).json({
                header: [{
                    error:`No hay comentarios para este productos`,
                    code: 205,
                }],
                body:[{}]
            })
        }

        if(findId.length === 0){
            return res.status(200).json({
                header: [{
                    error:`No hay comentarios para este productos`,
                    code: 205,
                }],
                body:[{}]
            })
        }

        for (const i in findId) {
            const userId = await Usuario.find({
                _id: ObjectId(findId[i].user)
            })

            // let data = {
            //     user: {
            //         name:userId[i].name,
            //         img:userId[i].img,
            //         firstName: userId[i].firstName,
            //         user:findId[i].user
            //     },
            //     coment:{
            //         text:findId[i].text,
            //         stars:findId[i].stars,
            //         idProduct:findId[i].idProduct,
            //         state:findId[i].state,
            //         _id:findId[i]._id,

            //     }
            // }
            if (userId.length > 0) {
                const firstName = userId[0].firstName;
                const name = userId[0].name;
                const img = userId[0].img

                let data = {
                    user:{
                        firstName,
                        name,
                        img
                    },
                    coments:{
                        text:findId[i].text,
                        stars:findId[i].stars,
                        idProduct:findId[i].idProduct,
                        state:findId[i].state,
                        _id:findId[i]._id,
                    }
                }

                resp.push(data)
            }
        }
    
        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                coments:resp
            }]
        })
     
     } catch (error) {
       console.log('obtenerProductoByIdCategory error ==> '+error)
          return res.status(500).json({
               header: [{
                    error: 'tuvimos un error, por favor intentalo mas tarde',
                    code: 500,
               }],
               body: [{}]
          })
     }

}

const createComentforProduct = async(req, res = response) => {

    try {

        const {text, stars, idProduct} = req.body

    if(text == '' || text == null || text == undefined){
        return res.status(200).json({
            header: [{
                error:`Se necesita el texto para crear el comentario`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(stars == '' || stars == null || stars == undefined){
        return res.status(200).json({
            header: [{
                error:`Se necesitan las estrellas para crear el comentario`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(idProduct == '' || idProduct == null || idProduct == undefined){
        return res.status(200).json({
            header: [{
                error:`No hay idProduct para crear el comentario`,
                code: 400,
            }],
            body:[{}]
        })
    }

    const idShop = await ProductUser.find({
        _id: ObjectId(idProduct),
        state:true
    });

    if(idShop) {

        const data = {
            text:text,
            stars:stars,
            idProduct:idProduct,
            user: req.usuario._id,
        }
    
    
        const coments = new Coments(data);
    
        //Guardar DB
    
        await coments.save(); 

    
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El comentario se creó correctamente',
                product
            }]
        })
    }else{
        res.status(200).json({
            header: [{
                error: 'El producto no existe',
                code: 200,
            }],
            body:[{}]
        })
    }




        
    } catch (error) {
        console.log('createComentforProduct error ==> '+error)
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
    getAllComentsOfUniqueProduct,
    createComentforProduct
}