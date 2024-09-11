const {Schema, model} = require('mongoose');

const OptioncategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    type:{
        type: String,
        required: true
    }
});

OptioncategorySchema.methods.toJSON = function() {
    const {__v, state, _id, ...Optioncategory} = this.toObject();
    Optioncategory.uid = _id;
    return Optioncategory
}


module.exports = model('OptioncategorySchema', OptioncategorySchema)