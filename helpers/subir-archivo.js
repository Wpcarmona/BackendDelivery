const { v4: uuidv4 } = require('uuid');
const path = require('path');

const validateExtension = (nameFile) => {

    const extensionValidate = ['png','jpg','jpeg','gif']

    return new Promise ((resolve, reject)=> {


        try {
            const nameCut = nameFile.split('.');
            const extension = nameCut[nameCut.length - 1];
            const nametoLower =  extension.toLowerCase();
        if(!extensionValidate.includes(nametoLower)){
                resolve(false)
        }else{
                resolve(true)
        }
        } catch (error) {
            reject(error)
        }
 
    })
    

}

const uploadFile = (files ,   folder = '' ,extensionValidate = ['png','jpg','jpeg','gif']) => {

    return new Promise ((resolve, reject) => {
        const { file } = files;
        const nameCut = file.name.split('.');
        const extension = nameCut[nameCut.length - 1];
    
        const nametoLower =  extension.toLowerCase();

        console.log('valor' + nametoLower)
    
        if(!extensionValidate.includes(nametoLower)){
             resolve({
                header: [{
                    error: 'el archivo no tiene un formato valido',
                    code: 400,
                }],
                body:[{}]
            }
            )
            
        }
        const nameTemp = uuidv4() + '.' + nametoLower;
      
        const uploadPath = path.join(__dirname, '../uploads/', folder , nameTemp);
      
        file.mv(uploadPath, (err) => {
          if (err) {
             resolve({
                header: [{
                    error: 'Internal server Error',
                    code: 500,
                    errr
                }],
                body:[{}]
            }
            );
          }

          resolve({
            header: [{
                error: 'NO ERROR',
                code: 200,
            }],
            body:[{
                path: nameTemp
            }]
          })
        }, error =>{
            reject(error)
        });

    });
     


}


module.exports = {
    uploadFile,
    validateExtension
}