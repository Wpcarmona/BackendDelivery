const {Router} = require('express');
const { validateJWT } = require('../middlewares/validar-jwt');
const { 
    deletePostUser, 
    updatePostUser, 
    CreatePostUser, 
    getAllPostUserById, 
    getAllPostUser, 
    getPostUser } = require('../controllers/postUser');



const router = Router();

router.get('/all',[
    validateJWT
], getAllPostUser)

router.get('/user',[
    validateJWT
],getPostUser)

router.get('/user/:id',[
    validateJWT
],getAllPostUserById)

router.post('/', [
    validateJWT
], CreatePostUser)

router.put('/:id',[
    validateJWT
],updatePostUser)

router.delete('/:id',[
    validateJWT
], deletePostUser)



module.exports = router;