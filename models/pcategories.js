

const {Schema, model} = require('mongoose');

const PcategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    type:{
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: true,
    }
});

PcategorySchema.methods.toJSON = function() {
    const {__v, state, _id, ...category} = this.toObject();
    category.uid = _id;
    return category
}


module.exports = model('Pcategory', PcategorySchema)