import { request, response } from "express";
import conn from "../database/dbConnection.js";
import { v4 } from "uuid";
import { uploadPicture } from "../tools/cloudinary.js";

class PostModel {
    constructor() {

    }

    static async createPost(req = request, res = response) {
        try {
            const { description, location, precio } = req.body;

            
            const post_id = v4();
            
            const {user_id} = req.user;
            
            if (!user_id) {
                return res.status(400).json({
                    message: 'Not authorized'
                });
            }//Verifica si el usuario ya inicio sesion
            
            await conn.query("insert into posts(post_id,description,location,precio,user_id) values(?,?,?,?,?)",
            [
                post_id,
                description,
                location,
                precio,
                user_id
            ]); // Realiza la insercion en la tabla posts
            
            for (const clave in req.files) {
                  const picture = req.files[clave];
                  const {secure_url,public_id} = await uploadPicture(picture.tempFilePath);
                  await conn.query(`insert into pictures set 
                  pic_id = ?, 
                  url = ?, 
                  post_id = ?;`,[public_id,secure_url,post_id]);
              }
              
            return res.status(201).json({
                message: 'Post has been created sucessfully'
            });
        } catch (err) {
            console.log(err, '=> server error');
            return res.status(500).json({
                message: 'An error has occurred'
            });
        }
    }
    static async updatePost(req = request, res = response){
        try {
            const {description, location, precio, post_id} = req.body;
            const {user_id} = req.user;

            if(!user_id){
                return res.status(200).json({
                    message : 'Not authorized'
                })
            }//verifica si el usuario inicio sesion

            await conn.query(`update posts set
            description = ?,
            location = ?,
            precio = ?,
            post_date = now()
            where post_id = ?
            `,[description,location, precio, post_id]); //realiza la actualizacion usando en el id del post

            return res.status(201).json({
                message : 'Actualizacion realizada con exito'
            });

        } catch (err) {
            console.log(err, '=> Server error');
            return res.status(500).json({
                message : 'Server failed, an error has ocurred'
            });
        }
    }
}


export default PostModel;