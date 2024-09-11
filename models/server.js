const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.app.use(express.json({limit: '50mb',extended:true}));
        this.app.use(express.urlencoded({limit: '50mb',extended: true}));
        

        this.path = {
            usuarios: '/deliveryshop/usuarios',
            auth    : '/deliveryshop/auth',
            category: '/deliveryshop/categories',
            products: '/deliveryshop/products',
            finds   : '/deliveryshop/finds',
            uploads : '/deliveryshop/uploads',
            pcategories: '/deliveryshop/pcategories',
            services: '/deliveryshop/services', 
            bienes: '/deliveryshop/bienes',
            presentation: '/deliveryshop/presentation',
            directory: '/deliveryshop/directory',
            location: '/deliveryshop/location',
            optioncategory: '/deliveryshop/optioncategory',
            categoryuser: '/deliveryshop/categoryuser',
            productuser: '/deliveryshop/productuser',
            postUser:    '/deliveryshop/postuser',
            saleOffer: '/deliveryshop/saleOffer',
            GetItemIdea: '/deliveryshop/getItemIdea',
            coments:     '/deliveryshop/coments'

        }

        // conectar a base de datos
        this.conectarDB();


        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //cors

        this.app.use(cors());

        //Lectura y parseo del body para POST
        this.app.use(express.json() );

        //Directorio publico
        this.app.use(express.static('public'));


       
       
        //FileupLoad - carga de archivos 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.path.auth,require('../routes/auth'));
        this.app.use(this.path.usuarios,require('../routes/user'));
        this.app.use(this.path.category,require('../routes/category'));
        this.app.use(this.path.products,require('../routes/product'));
        this.app.use(this.path.finds,require('../routes/find'));
        this.app.use(this.path.uploads,require('../routes/uploads'));
        this.app.use(this.path.pcategories, require('../routes/pcategories'));
        this.app.use(this.path.bienes, require('../routes/bienes'));
        this.app.use(this.path.services, require('../routes/services'));
        this.app.use(this.path.presentation, require('../routes/presentation'));
        this.app.use(this.path.directory, require('../routes/directory'));
        this.app.use(this.path.location, require('../routes/location'));
        this.app.use(this.path.optioncategory, require('../routes/optioncategory'));
        this.app.use(this.path.categoryuser, require('../routes/categoryuser'));
        this.app.use(this.path.productuser, require('../routes/productsuser'));
        this.app.use(this.path.postUser, require('../routes/postUser'));
        this.app.use(this.path.saleOffer, require('../routes/sale'));
        this.app.use(this.path.GetItemIdea, require('../routes/GetItemIdea'));
        this.app.use(this.path.coments, require('../routes/coments'))
    }

    listen(){
        this.app.listen(this.port)
    }


}

module.exports = Server;