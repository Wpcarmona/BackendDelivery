
const {Schema, model} = require('mongoose');

const DirectorySchema = Schema({
    name: {
        type: String,
    },
    randomId:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    model:{
        type: String,
        required: true
    },
    time:{
        type: [],
        required: true
    },
    numberContact:{
        type: String,
        default: ''
    },
    numberWhatsApp:{
        type: Boolean,
        default:false
    },
    delibery:{
        type:Boolean,
        required:true
    },
    adress:{
        type: String,
        default:''
    },
    img:{
        type: String,
        default: 'https://res.cloudinary.com/drkqwwoxd/image/upload/v1670947973/4841500_a2lrri.png',
    },
    description:{
        type: String,
        default: '',
    },
    state: {
        type: Boolean,
        default: true,
    },
    property:{
        type:String,
        default: ''
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
    empres:{
        type:String,
        default:false,
    }
});

DirectorySchema.methods.toJSON = function() {
    const {__v, state, _id, randomId, ...directory} = this.toObject();
    directory.uid = _id;
    return directory
}


module.exports = model('Directory', DirectorySchema)