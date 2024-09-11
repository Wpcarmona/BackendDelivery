const { response } = require("express");



const esAdminRole = (req, res = response, next) => {


    if(!req.usuario){
        return res.status(500).json({
            header: [{
                error:'SE QUIERE VALIDAR EL ROLE SIN VALIDAR EL TOKEN PRIMERO',
                code: 500,
            }],
            body:[{}]
        })
    }

    const {role, name} = req.usuario;

    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            header: [{
                error:`${name} NO ES ADMINISTRADOR`,
                code: 401,
            }],
            body:[{}]
        })
    }

    next();
}


const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {
        if(!req.usuario){
            return res.status(500).json({
                header: [{
                    error:'SE QUIERE VALIDAR EL ROLE SIN VALIDAR EL TOKEN PRIMERO',
                    code: 500,
                }],
                body:[{}]
            })
        }
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                header: [{
                    error:`EL SERVICIO REQUIERE UNO DE LOS SIGUIENTES ROLES ${roles}`,
                    code: 401,
                }],
                body:[{}]
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}