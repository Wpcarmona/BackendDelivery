

const {Schema, model} = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: ''
    }

});

ProductSchema.methods.toJSON = function() {
    const {__v, state, _id, ...category} = this.toObject();
    category.uid = _id;
    return category
}


module.exports = model('Product', ProductSchema)