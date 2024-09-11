const {Schema, model} = require('mongoose');

const LocationSchema = Schema({
    randomId:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    name: {
        type: String,
    },
    adress:{
        type: String,
        default:''
    },
    star: {
        type: Number,
        default:0
    },
    model:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ''
    },
    state: {
        type: Boolean,
        default: true,
    },
    img:{
        type: String,
        default: 'https://res.cloudinary.com/drkqwwoxd/image/upload/v1670947973/4841500_a2lrri.png',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    lat: {
        type: Number,
        default: null,
    },
    lng: {
        type: Number,
        default: null,
    },
    time:{
        type: [],
        required: true
    },
    numberContact:{
        type: String,
        default: ''
    },
    delibery:{
        type:Boolean,
        required:true
    },
    numberWhatsApp:{
        type: Boolean,
        default:false
    },
    empres:{
        type:String,
        default:false,
    }
});

LocationSchema.methods.toJSON = function() {
    const {__v, state, _id, randomId, ...location} = this.toObject();
    location.uid = _id;
    return location
}


module.exports = model('Location', LocationSchema)