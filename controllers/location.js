const { response } = require("express");
const {Location, Usuario, Directory} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const ObtenerLocation = async(req, res= response) => {

    try {
    
        const {limit, desde} = req.query;
        const query = {state: true}
        const [total, Loc] = await Promise.all([
            Location.countDocuments(query),
            Location.find(query)
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
                Loc
                
            }]
        })    
    } catch (error) {
      console.log('ObtenerLocation error ==> '+error)
         return res.status(500).json({
              header: [{
                   error: 'tuvimos un error, por favor intentalo mas tarde',
                   code: 500,
              }],
              body: [{}]
         })
    }

   

}

const CrearLocation = async(req, res = response) => {

    try {
        const {name, lat, lng, adress} = req.body;

        const data = {
            name:name.toUpperCase(),
            adress:adress.toUpperCase(),
            user:req.usuario._id,
            lat:lat,
            lng:lng,
            img: req.body.img
        }
    
        const location = new Location(data);
    
        await location.save();  
    
    } catch (error) {
      console.log('CrearLocation error ==> '+error)
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
    ObtenerLocation,
    CrearLocation
}