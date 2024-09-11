const { response } = require("express");
const {Usuario, Directory, CategoryUser, ProductUser, Sales} = require('../models');
const { dateFormat } = require("../helpers/helpersfunction");
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate


const getAllItemsuser = async(req, res=response) => {

    const user = req.usuario._id;
    const {id} = req.params;

    try {
        //const findUser = await Usuario.find(user)

        const findIdea = await Directory.findById(id)

        const queryCategory = {
            user,
            state:true
        }

        const findCategory = await CategoryUser.find({
            ideaId:id,
            state:true
        });

        var findProductsUser = await ProductUser.find({
            user,
            state:true,
            idea:id
        });

        var OfferIdea = await Sales.find({
            directory:id
        })

        

        for (let i = 0; i < OfferIdea.length; i++) {
            const date = new Date();
            const actual = date.toLocaleString("es-CO")
            const actualDate = dateFormat(actual)
            const estimate = OfferIdea[i].time
            let calc= estimate - actualDate;
            // console.log({actual,actualDate,estimate,calc})
            if(calc<0){
                OfferIdea[i].state = false
            }

            var idOffers = new ObjectId(OfferIdea[i].productId)

            var findProductsUserDirectory = await ProductUser.findById(idOffers);
            

            
         
            OfferIdea[i]= {
                'sale':OfferIdea[i].sale,
                'time':OfferIdea[i].time,
                'state':OfferIdea[i].state,
                'desc':OfferIdea[i].desc,
                'id':OfferIdea[i]._id,
                'directory':OfferIdea[i].directory,
                'product':{
                    'name':findProductsUserDirectory.name,
                    'price':findProductsUserDirectory.price,
                    'description':findProductsUserDirectory.description,
                    'img':findProductsUserDirectory.link[0],
                    'productId':OfferIdea[i].productId,

                }
            }

         
        }

        const data = {
            'idea':findIdea,
            'categories':findCategory,
            'products':findProductsUser,
            'Offers':OfferIdea
        }

        
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[
                data
            ]
        }) 
    
    
    } catch (error) {
      console.log('getAllItemsUser error ==> '+error)
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
    getAllItemsuser
}