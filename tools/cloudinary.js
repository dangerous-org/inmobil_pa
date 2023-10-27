import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.NAME_CLOUDINARY, 
  api_key: process.env.KEY_CLOUDINARY, 
  api_secret:  process.env.SECRET_CLOUDINARY
});

export const uploadPicture = async(path) => {
   return await cloudinary.uploader.upload(path,{
    folder : 'inmobil'
   });
}