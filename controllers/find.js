const { response } = require("express");
const { Usuario, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;


const allowedcollections = [
    'usuarios',
    'categories',
    'products',
    'roles'
];


const find = (req, res=response) =>{

    const {colection, term} = req.params

    if(!allowedcollections.includes(colection)){
        return res.status(200).json({
            header: [{
                error:`las colecciones permitidas son ${allowedcollections}`,
                code: 400,
            }],
            body:[{ }]
        })
    }

    const findCategories = async(term = '', res = response) => {
        const isMongoId = ObjectId.isValid(term);
      
        if(isMongoId){
            const category = await Category.findById(term);
            return res.status(200).json({
                header: [{
                    error:`NO ERROR`,
                    code: 200,
                }],
                body:[{
                    category
                }]
            })
        }

        const RegEx = new RegExp(term, 'i')

        const category = await Category.find({ name:RegEx, state:true});
        return res.status(200).json({
            header: [{
                error:`NO ERROR`,
                code: 200,
            }],
            body:[{
                category
            }]
        })

    }
    
    const  findUser= async(term = '', res = response) => {
        const isMongoId = ObjectId.isValid(term);
      
        if(isMongoId){
            const usuario = await Usuario.findById(term);
            return res.status(200).json({
                header: [{
                    error:`NO ERROR`,
                    code: 200,
                }],
                body:[{
                    usuario
                }]
            })
        }

        const RegEx = new RegExp(term, 'i')

        const users = await Usuario.find({
            $or:[
                {name:RegEx}, {email:RegEx}
            ],
            $and: [
                {state:true}
            ]
        });
        return res.status(200).json({
            header: [{
                error:`NO ERROR`,
                code: 200,
            }],
            body:[{
                users
            }]
        })

    }

    const findProducts = async(term = '', res = response) => {
        const isMongoId = ObjectId.isValid(term);
      
        if(isMongoId){
            const product = await Product.findById(term).populate('category', 'name');
            return res.status(200).json({
                header: [{
                    error:`NO ERROR`,
                    code: 200,
                }],
                body:[{
                    product
                }]
            })
        }

        const RegEx = new RegExp(term, 'i')

        const product = await Product.find({ name:RegEx, state:true}).populate('category', 'name');
        return res.status(200).json({
            header: [{
                error:`NO ERROR`,
                code: 200,
            }],
            body:[{
                product
            }]
        })
    }

    switch (colection) {
        case 'usuarios':
            findUser(term, res)
        break;
    
        case 'categories':
            findCategories(term, res)
        break;
        case 'products':
            findProducts(term, res)
        break;
        default: 
        res.status(500).json({
            header: [{
                error:`INTERNAL SERVER ERROR`,
                code: 500,
            }],
            body:[{}]
        })
    }

}

module.exports = {
    find
}