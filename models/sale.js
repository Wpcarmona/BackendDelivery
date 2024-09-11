
const {Schema, model} = require('mongoose');

const SaleSchema = Schema({
    sale: {
        type:String,
        required: true
    },
    productId: {
        type:String,
        default:''
    },
    directory:{
        type:String,
        default: ''
    },
    time: {
        type: Number,
        required:true
    },
    state: {
        type: Boolean,
        default: true,
    },
    desc: {
        type:Number,
        default:0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

SaleSchema.methods.toJSON = function() {
    const {__v, _id, ...SaleOffer} = this.toObject();
    SaleOffer.uid = _id;
    return SaleOffer
}


module.exports = model('SaleOffer', SaleSchema)