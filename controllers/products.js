const { response } = require("express");
const {Product, ProductUser} = require('../models');
const { search } = require("../routes/auth");
const { ObjectId } = require('mongoose').Types;



const obtenerProducts = async(req, res= response) => {
    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, Products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('user','name')
        .populate('category','name')
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
            Products
        }]
    })    
}

const obtenerProduct = async(req, res= response) =>{

    const {id} = req.params;
    const  product = await ProductUser.find({name:id})

    if(!product){
        res.status(200).json({
            header: [{
                error:'Lo sentimos, no encontramos nada relacionado',
                code: 200,
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
            product
        }]
    }) 
}

const obtenerTodosProductsByID = async(req, res= response) =>{

    const {term} = req.params

    const findProductsByID = await Product.find({
        category: ObjectId(term)

    }).populate('user','name')

    if(findProductsByID ==''){
        return res.status(200).json({
            header: [{
                error:'No hay productos registrados',
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
            findProductsByID
        }]
    }) 
}


const crearProduct = async(req, res= response) => {

    const {user, state, ...body } = req.body;

    const ProductDB = await Product.findOne({ name: body.name});

    if(ProductDB) {
        return res.status(200).json({
            header: [{
                error:`el producto ${ProductDB.name}, ya existe`,
                code: 400,
            }],
            body:[{}]
        })
    }

    //Generar la data a guardar

    const data = {
        name: body.name.toUpperCase(),
        user: req.usuario._id,
        ...body
     
    }

    const product = new Product(data);

    //Guardar DB

    await product.save(); 

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'el producto se creo correctamente',
            product
        }]
    })

}


const actualizarProducts = async(req, res= response) => {
    const {id} = req.params;
    const {state, user,...data} = req.body;

    if(data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.usuario._id;

    const product = await Product.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se actualizo correctamente',
            product
        }]
    })
}


const BorrarProducts = async(req, res= response) => {

    const {id} = req.params;
    const productDelete = await Product.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se borro correctamente',
            productDelete
        }]
    })
}


module.exports = {
    obtenerProducts,
    crearProduct,
    actualizarProducts,
    BorrarProducts,
    obtenerProduct,
    obtenerTodosProductsByID
}