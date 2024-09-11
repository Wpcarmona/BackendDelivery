const {Schema, model} = require('mongoose');

const CategoryUserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
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
    ideaId: {
        type: String,
        required: true
    },
    color: {
        type:String,
        required:true
    }
});

CategoryUserSchema.methods.toJSON = function() {
    const {__v, state, _id, ...categoryNameUser} = this.toObject();
    categoryNameUser.uid = _id;
    return categoryNameUser;
}


module.exports = model('CategoryUser', CategoryUserSchema)