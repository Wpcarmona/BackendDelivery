
const {Schema, model} = require('mongoose');

const PresentationSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img:{
        type: String,
        default: '',
    },
    description:{
        type: String,
        default: '',
    }, 
    type:{
        type: String,
        required: true
    }, 
    property:{
        type:String,
        required: true
    },
    state: {
        type: Boolean,
        default: true,
    }
});

PresentationSchema.methods.toJSON = function() {
    const {__v, state, _id, ...category} = this.toObject();
    category.uid = _id;
    return category
}


module.exports = model('Presentation', PresentationSchema)