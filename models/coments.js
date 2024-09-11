const {Schema, model} = require('mongoose');

const ComentsSchema = Schema({
    text: {
        type: String,
        required: [true, 'el texto es obligatorio'],
    },
    stars:{
        type: Number,
        default: 1
    },
    state: {
        type: Boolean,
        default: true,
    },
    idProduct:{
        type: String,
        default:''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

ComentsSchema.methods.toJSON = function() {
    const {__v, state, _id, ...coments} = this.toObject();
    coments.uid = _id;
    return coments
}


module.exports = model('Coments', ComentsSchema)