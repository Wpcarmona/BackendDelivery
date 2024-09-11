const { response } = require("express");
const {ProductUser} = require('../models');
const { ObjectId } = require('mongoose').Types;
const {CategoryUser} = require('../models');
const {Directory, Usuario, Sales} = require('../models');
const { dateFormat } = require("../helpers/helpersfunction");
const { uploadImage } = require("../helpers/helpersfunction");
const { model } = require("mongoose");


const obtenerTodasProductByUserID= async(req, res= response) => {

   

try {
    const {id} = req.usuario._id
    const query = {state: true}
    const findProduct = await ProductUser.find({
        user: ObjectId(id),
        state:true

    }).populate('user','name')
    const countCategories = await ProductUser.countDocuments({
        query,
        user: req.usuario._id,
        state:true
    })

    if(findProduct =='' || findProduct == null || findProduct == undefined ){
        return res.status(200).json({
            header: [{
                error:'No tienes productos registrados',
                code: 200,
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
            Products:findProduct
        }]
    })


} catch (error) {
  console.log('obtenerTodasProductByUserID error ==> '+error)
     return res.status(500).json({
          header: [{
               error: 'tuvimos un error, por favor intentalo mas tarde',
               code: 500,
          }],
          body: [{}]
     })
}
    
}

const obtenerTodosLosProductosByUserID= async(req, res= response) => {

   

    try {
        const {id} = req.params;
        const query = {state: true}
        const findProduct = await ProductUser.find({
            user: ObjectId(id),
            state:true
    
        })

        const findDirectory = await Directory.find({
            user:ObjectId(id)
        })
    
        if(findProduct =='' || findProduct == null || findProduct == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No tienes productos registrados',
                    code: 200,
                }],
                body:[{}]
            }) 
        }

        if(findDirectory =='' || findDirectory == null || findDirectory == undefined ){
            return res.status(200).json({
                header: [{
                    error:'No tienes productos registrados',
                    code: 200,
                }],
                body:[{}]
            }) 
        }

        const dataDirectory = {
            'name':findDirectory[0].name,
            'model':findDirectory[0].model,
            'time':findDirectory[0].time,
            'numberContact':findDirectory[0].numberContact,
            'numberWhatsApp':findDirectory[0].numberWhatsApp,
            'delibery':findDirectory[0].delibery,
            'adress':findDirectory[0].adress,
            'img':findDirectory[0].img,
            'description':findDirectory[0].description,
            'lat':findDirectory[0].lat,
            'lng':findDirectory[0].lng
        }

        var products = []

        for (const i in findProduct) {

            const product = {
                'name':findProduct[i].name,
                'price':findProduct[i].price,
                'link':findProduct[i].link[0],
                'description':findProduct[i].description,
                'id':findProduct[i]._id
            }
            products.push(product)
        }


        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                Directory:dataDirectory,
                Products:products
            }]
        })
    
    
    } catch (error) {
      console.log('obtenerTodasProductByUserID error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }
        
    }

const getProductByStars = async(req, res=response) => {


    try {

        var productsStart = [];

        const  findProduct = await ProductUser.find({
            state:true
        })



        
    for (const i in findProduct) {
        if(findProduct[i].stars === 5 || findProduct[i].stars === 4){
            productsStart.push(findProduct[i])
        }
    }

        productsStart.sort((a, b) => b.stars - a.stars);

    if (productsStart.length > 8) {
        productsStart.splice(9);
    }


        return res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                productsStart
            }]
        })
        
    } catch (error) {
        console.log('obtenerProductMejoresPuntuados error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
    }

}

const obtenerProductoByIdCategory = async( req, res= response)=> {

 try {
    const {id} = req.params;
    const query = {state: true}

    const findId = await ProductUser.find({
        category: ObjectId(id),
        state:true

    })

    const findCategoriesByID = await CategoryUser.find({
        _id: ObjectId(id),
        state:true

    }).populate('user','name')

    const countCategories = await ProductUser.countDocuments({
        query,
        category: ObjectId(id),
        state:true
    })

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto registrado`,
                code: 400,
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
            product:findId,
            category:findCategoriesByID
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

const obtenerProductById = async(req, res=response)=> {
   try {
    const {id} = req.params;

    

    const findId = await ProductUser.find({
        _id: ObjectId(id),
        state:true
    });

    const findCategoriesByID = await CategoryUser.find({
        _id: findId[0].category,
        state:true
 
    }).populate('user','name');

    let findSales = await Sales.findOne({
        productId: id
    })

    if(findSales){
        const date = new Date();
        const actual = date.toLocaleString("es-CO");   
        const actualDate = dateFormat(actual)
    
        const totalDate = findSales.time - actualDate;
    
        if(findSales.state == false || totalDate < 0){
            findSales = null
        }
    }else if (findSales == null){
        findSales = null
    }

    const {
        name,
        model,
        startHour,
        endHour,
        numberContact,
        numberWhatsApp,
        adress,
        img,
        description,
        completeHour,
        lat,
        lng,
        time,
        user
    } = await Directory.findById({
        _id:findCategoriesByID[0].ideaId
    });

    if(!findId){
        return res.status(200).json({
            header: [{
                error:'el producto con ese ID no existe',
                code: 200,
            }],
            body:[{}]
        }) 
    }
    if(findId == '' || findId == null || findId == undefined){
        return res.status(200).json({
            header: [{
                error:'el producto fue eliminado',
                code: 200,
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
            product:[{
                name:findId[0].name,
                description:findId[0].description,
                price:findId[0].price,
                link:findId[0].link,
                stars:findId[0].stars
            }],
            category:[{
                name:findCategoriesByID[0].name,
                user:findCategoriesByID[0].user.name,
            }],
            idea:[{
                name,
                model,
                startHour,
                endHour,
                numberContact,
                numberWhatsApp,
                adress,
                img,
                description,
                completeHour,
                lat,
                lng,
                user,
                time, 
            }],
            Offer:findSales
        }]
    })
   
   } catch (error) {
     console.log('obtenerProductById error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }
}

const crearProductUser = async(req, res= response) => {

    const linksArray = [];

   try {
    const {name, category, idea, img,...todo} = req.body

    if(idea == '' || idea == null || idea == undefined){
        return res.status(200).json({
            header: [{
                error:`No hay idea para crear el producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(category == '' || category == null || category == undefined){
        return res.status(200).json({
            header: [{
                error:`No hay categoria para crear el producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre del producto`,
                code: 400,
            }],
            body:[{}]
        })
    }


    const productDB = await ProductUser.findOne({
        name:name.toUpperCase(),
        user:ObjectId(req.usuario._id)
   });

    if(productDB) {
        return res.status(200).json({
            header: [{
                error:`El producto ${name}, ya está registrado.`,
                code: 400,
            }],
            body:[{}]
        })
    }

    

    for (let i = 0; i < img.length; i++) {

        let imga = await uploadImage(img[i])
        linksArray.push(imga)
        
    }

    //Generar la data a guardar

    const data = {
        name:name.toUpperCase(),
        category: ObjectId(category),
        price:todo.price,
        idea,
        link:linksArray,
        description:todo.description,
        user: req.usuario._id,
        stars: 0,
    }


    const product = new ProductUser(data);

    //Guardar DB

    await product.save(); 


    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se creó correctamente',
            product
        }]
    })
   
   } catch (error) {
     console.log('crearProductUser error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }

}

const actualizarProductUser = async(req, res = response) => {

   try {
    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findId = await ProductUser.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto registrado`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.user = req.user;

    const category = await ProductUser.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se actualizó correctamente',
            category
        }]
    })
   
   } catch (error) {
     console.log('actualizarProductUser error ==> '+error)
        return res.status(500).json({
             header: [{
                  error: 'tuvimos un error, por favor intentalo mas tarde',
                  code: 500,
             }],
             body: [{}]
        })
   }
}

const borrarProductUser =  async(req, res=response) => {

try {
    const {id} = req.params;

    const findId = await ProductUser.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe ese producto`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const categoryDelete = await ProductUser.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El producto se borró correctamente',
            categoryDelete
        }]
    })

} catch (error) {
  console.log('borrarProductUser error ==> '+error)
     return res.status(500).json({
          header: [{
               error: 'tuvimos un error, por favor intentalo mas tarde',
               code: 500,
          }],
          body: [{}]
     })
}

}

const findProductsByName = async (req, res=response) => {

try {
    const {productName} = req.body

    const mesg = productName.toUpperCase().trim();

    var resp = [];

    if(mesg == '' || mesg == null || mesg == undefined){

        const findId = (await ProductUser.find({state:true}))

        for (let i = 0; i < findId.length; i++) {
            const element = findId[i].idea;
            const empres = await Directory.findById(element)            
            resp.push({
                "starsProm": findId[i].starsProm,
                "name": findId[i].name,
                "category": findId[i].category,
                "price": findId[i].price,
                "link": findId[i].link,
                "description": findId[i].description,
                "idea": findId[i].idea,
                "user": findId[i].user,
                "stars": findId[i].stars,
                "uid": findId[i].id,
                "filter":{
                    "empres":empres.empres,
                    "model":empres.model
                }
                
            })
            
           
    
        }


        return res.status(200).json({
            header: [{
                error:`NO ERROR`,
                code: 200,
            }],
            body:[{
                products: resp
            }]
        })

    }

    const findId = (await ProductUser.find({state:true})).filter(
        find => find.name.toUpperCase().includes(mesg)
    )

    if(findId == '' || findId == null || findId == undefined){

        return res.status(200).json({
            header: [{
                error:`Lo sentimos, no pudimos encontrar nada`,
                code: 201,
            }],
            body:[{}]
        })

    }

    
    for (let i = 0; i < findId.length; i++) {
        const element = findId[i].idea;
        const empres = await Directory.findById(element)
        console.log(empres.empres, empres.model)
        
        
        console.log(findId[i])
       

    }

    //TODO reparar las ofetas en la busqueda de productos

    // var Offers = [];
    
    // for (let i = 0; i < findId.length; i++) {
    //     const Obj = findId[i]._id;
    //     const Offer = await Sales.find({
    //         productId: Obj.toString()
    //     })
    //     console.log(findId[i], Offer)
    //     if(Offer){
    //         for (let j = 0; j < Offer.length; j++) {
    //             if(Offer[j]){
    //                Offers.push({
    //                    'product': [
    //                       { 
    //                        name:findId[i].name,
    //                        category:findId[i].category,
    //                        price:findId[i].price,
    //                        description: findId[i].description
    //                    }
    //                    ], 
    //                    'Offers': [{
    //                        sale: Offer[j].sale,
    //                        state: Offer[j].state,
    //                    }]
    //                })
    //               }
    //           } 
    //     }else{
    //         Offers.push({
    //             'product': [
    //                 { 
    //                 name:findId[i].name,
    //                 category:findId[i].category,
    //                 price:findId[i].price,
    //                 description: findId[i].description
    //             }
    //             ], 
    //             'Offers': [{}]
    //         })
    //     }
    // }

        

    return res.status(200).json({
        header: [{
            error:`NO ERROR`,
            code: 200,
        }],
        body:[{
            products: resp,
            //Offers
            
        }]
    })

} catch (error) {
  console.log('findProductsByName error ==> '+error)
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
    obtenerTodasProductByUserID,
    obtenerTodosLosProductosByUserID,
    obtenerProductoByIdCategory,
    obtenerProductById,
    crearProductUser,
    actualizarProductUser,
    borrarProductUser,
    findProductsByName,
    getProductByStars
}