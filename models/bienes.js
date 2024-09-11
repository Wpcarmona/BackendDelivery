
const {Schema, model} = require('mongoose');

const BienesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img:{
        type: String,
        default: 'https://res.cloudinary.com/drkqwwoxd/image/upload/v1670947973/4841500_a2lrri.png',
    },
    description:{
        type: String,
        default: '',
    },
    type:{
        type: String,
        required: true
    }, 
    state: {
        type: Boolean,
        default: true,
    },
    property:{
        type:String,
        default: 'BIEN'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

BienesSchema.methods.toJSON = function() {
    const {__v, state, _id, ...category} = this.toObject();
    category.uid = _id;
    return category
}


module.exports = model('Bienes', BienesSchema)