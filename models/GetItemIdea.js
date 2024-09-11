const {Schema, model} = require('mongoose');

const GetItemIdeaSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ProductUser: {
        type: Schema.Types.ObjectId,
        ref: 'ProductsUser',
        required:true
    },
    CategoryUser: {
        type: Schema.Types.ObjectId,
        ref:'CategoryUser',
        required:true
    },
    PostUser: {
        type: Schema.Types.ObjectId,
        ref:'PostUser',
        required: true
    }
});

GetItemIdeaSchema.methods.toJSON = function() {
    const {__v, state, _id, randomId, ...GetItemIdea} = this.toObject();
    GetItemIdea.uid = _id;
    return GetItemIdea
}


module.exports = model('GetItemIdea', GetItemIdeaSchema)