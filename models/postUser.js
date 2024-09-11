
const {Schema, model} = require('mongoose');

const PostUserSchema = Schema({
    title: {
        type: String,
        required: true
    },
    img:{
        type: [],
        default: [],
    },
    idShop:{
        type: String,
        default: '',
    },
    description:{
        type: String,
        required: true,
        default: '',
    },
    state: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

PostUserSchema.methods.toJSON = function() {
    const {__v, state, _id, ...PostUser} = this.toObject();
    PostUser.uid = _id;
    return PostUser
}


module.exports = model('PostUser', PostUserSchema)