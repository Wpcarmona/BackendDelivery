const cloudinary = require('cloudinary').v2;


const dateFormat = (value) => {


    day = value.substring(0,2)
    month= value.substring(3,4)
    year = value.substring(5,9)
    const date = year+month+day
    return parseInt(date)
}

const obtenerFechaActual = () =>{
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  const numberActual = `${anio}${mes}${dia}`;
  const numberDay = parseInt(numberActual)
  return numberDay;
}


const convertirFechaANumero = (fecha)  =>{
  const partes = fecha.split('/');
  
  if (partes.length !== 3) {
    return null; 
  }
  
  const dia = parseInt(partes[0]);
  const mes = parseInt(partes[1]);
  const anio = parseInt(partes[2]);
  
  if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
    return null; 
  }
  
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return null; 
  }
  
  const fechaNumerica = anio * 10000 + mes * 100 + dia;
  return fechaNumerica;
}



const uploadImage = async(img)=> {

    
    try {
        const res = await cloudinary.uploader.upload(img);
        return res.secure_url;
      } catch (error) {
        if (error.http_code === 400) {
          return false;
        } else {
          throw error;
        }
    }
}


module.exports ={
    dateFormat,
    uploadImage,
    obtenerFechaActual,
    convertirFechaANumero
}