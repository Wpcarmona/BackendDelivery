const { response } = require("express")



const validatefileUpload = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(200).json({
          path: {
            header: [{
              error: 'No hay archivos que subir',
              code: 400,
            }],
            body:[{}]
          }
        });
      }
      next()
}

module.exports = { 

    validatefileUpload
}