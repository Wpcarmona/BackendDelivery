const { response } = require("express");
const {Usuario, Sales, ProductUser, CategoryUser, Directory} = require('../models');
const { dateFormat,obtenerFechaActual,convertirFechaANumero } = require("../helpers/helpersfunction");
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const getAllSaleOffer = async(req, res=response) => {

    try {
        const query = {
            state: true 
        }
        const findSales = await Sales.find(query);

        var Offers = [];

        for (let i = 0; i < findSales.length; i++) {
            const calc = findSales[i].time - obtenerFechaActual();
            // calc > 0
           if(calc > 0){ 
            const product = await ProductUser.findById(findSales[i].productId);
            const category = await CategoryUser.findById(product.category);
            const user = await Usuario.findById(findSales[i].user);
            const userte = user._id
            const d = await Directory.findOne({
                user:userte
            })
            // console.log(d)
            const data = {
                'Price': product.price,
                'sale': findSales[i].sale,
                'time':findSales[i].time,
                'state':findSales[i].state,
                'img':product.img,
                'id':findSales[i]._id,
                'desc':findSales[i].desc,
                'Product': {
                    'name':product.name,
                    'description':product.description,
                    'img':product.link[0],
                    'category':{
                        'name':category.name
                    }
                },
                user:{
                    'name':user.name,
                    'phone':user.phone,
                    'emai':user.email,
                    'img':user.img,
                    'idUser':user.id,  
                    'firstName':user.firstName
                },
                directory:{
                    'name':d.name,
                    'description':d.description,
                    'model':d.model,
                    'startHour':d.startHour,
                    'endHour':d.endHour,
                    'numberWhatsApp':d.numberWhatsApp,
                    'numberContact':d.numberContact,
                    'address':d.adress,
                    'img':d.img,
                    'idShop':d.id,
                    'completeHour':d.completeHour,
                    'lat':d.lat,
                    'lng':d.lng,
                    'time':d.time
                }
            }
            Offers.push(data)
           }
            
        }


        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                saleOffers:Offers
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


const getAllSaleOfferById = async(req, res=response) => {

    const user = req.usuario._id
    

    try {

        const findSaleId = await Sales.find({
            user:user
        })

        if(!findSaleId){
            return res.status(200).json({
                header: [{
                    error:`No encontramos productos con el id`,
                    code: 400,
                }],
                body:[{}]
            })
        }

        
        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                mySalesId:findSaleId
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


const postCreateOffer = async(req, res= response) => {

    const {productId, sale, time, idea} = req.body;


    if(idea == '' || idea == null || idea == undefined){
        return res.status(200).json({
            header: [{
                error:`el id de la idea es requerido`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(productId == '' || productId == null || productId == undefined){
        return res.status(200).json({
            header: [{
                error:`el id del producto es requerido`,
                code: 400,
            }],
            body:[{}]
        })
    }


    if(sale == '' || sale == null || sale == undefined){
        return res.status(200).json({
            header: [{
                error:`el valor del descuento es requerido`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(time == '' || time == null || time == undefined){
        return res.status(200).json({
            header: [{
                error:`el tiempo es requerido`,
                code: 400,
            }],
            body:[{}]
        }) 
    }

    console.log(time)
   
    const date = new Date();
    const actual = date.toLocaleString("es-CO");    
    // const userDate = dateFormat(time);
    // const actualDate = dateFormat(actual);
    // console.log({date, actual,userDate,actualDate})

    const userDate = convertirFechaANumero(time)
    console.log(userDate)
    
    if((userDate - obtenerFechaActual()) <= 0){
        return res.status(200).json({
            header: [{
                error:`el dia y hora no puede ser menor al dia y hora actual`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(parseInt(sale) > 100){
        return res.status(200).json({
            header: [{
                error:`el descuento no puede ser mayor al 100%`,
                code: 400,
            }],
            body:[{}]
        })
    } 

    try {

        const findDirectory = await Directory.find({
            _di: new ObjectId(idea)   
        })

        if(!findDirectory){
            return res.status(200).json({
                header: [{
                    error:`No pudimos encontrar el directorio seleccionado`,
                    code: 400,
                }],
                body:[{}]
            })
        } 

        const findProduct = await ProductUser.find({
            _id: new ObjectId(productId)
        })

        if(!findProduct){
            return res.status(200).json({
                header: [{
                    error:`No pudimos encontrar el producto seleccionado`,
                    code: 400,
                }],
                body:[{}]
            })
        } 

        const findSaleOffer = await Sales.findOne({
            productId
        })

        const val1 = parseInt(findProduct[0].price);
        const val2 = parseInt(sale);
        const desc1 = (val1*val2)/100;
        const totalDe = val1 - desc1;

        

        if(findSaleOffer){
            const date = new Date();
            const actual = date.toLocaleString("es-CO");    
            const userDate = findSaleOffer.time;
            const actualDate = dateFormat(actual)
            const timeActual = userDate - actualDate;

            if((timeActual>0)){
                return res.status(200).json({
                    header: [{
                        error:`El producto ya posee una oferta activa`,
                        code: 400,
                    }],
                    body:[{}]
                })
            }else {
                await Sales.findByIdAndUpdate(findSaleOffer._id,{state:false})
                return res.status(200).json({
                    header: [{
                        error:`El producto posee una oferta inactiva`,
                        code: 400,
                    }],
                    body:[{}]
                })
            }
        }

        const data = {
            productId,
            sale,
            time:userDate,
            user: req.usuario._id,
            desc:totalDe,
            directory: idea
        }
    
    
        const saleOffer = new Sales(data);
    
        //Guardar DB
    
        await saleOffer.save();

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'la oferta se creo correctamente',
                saleOffer
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

const putUpdateOffer = async(req, res=response) => {

    const {id} = req.params;

    const {sale} = req.body;

    if(id == null || id == '' || id == undefined){
        return res.status(200).json({
            header: [{
                error:`el id es requerido`,
                code: 400,
            }],
            body:[{}]
        })
    }


    if(parseInt(sale) > 100){
        return res.status(200).json({
            header: [{
                error:`el descuento no puede ser mayor al 100%`,
                code: 400,
            }],
            body:[{}]
        })
    } 

    try {
        const findSale = await Sales.find({
            _id:id
        })
    
        if(!findSale){
            return res.status(200).json({
                header: [{
                    error:`No pudimos encontrar la oferta seleccionada`,
                    code: 400,
                }],
                body:[{}]
            })
        }

        
        const salesUpdate = await Sales.findByIdAndUpdate(id , {sale:sale}, {new:true});

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El descuento se actualizo correctamente',
                salesUpdate
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
const deleteOffer = async(req, res=response) => {

    const {id} = req.params;

    if(id == null || id == '' || id == undefined){
        return res.status(200).json({
            header: [{
                error:`el id es requerido`,
                code: 400,
            }],
            body:[{}]
        })
    }

    try {
        const findSale = await Sales.find({
            _id:id
        })
    
        if(!findSale){
            return res.status(200).json({
                header: [{
                    error:`No pudimos encontrar la oferta seleccionada`,
                    code: 400,
                }],
                body:[{}]
            })
        }

        await Sales.findByIdAndUpdate(id , {state:false}, {new:true});

        res.status(200).json({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                msg: 'El descuento se borró correctamente',
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
   getAllSaleOffer,
   getAllSaleOfferById,
   postCreateOffer,
   putUpdateOffer,
   deleteOffer
}