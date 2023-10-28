import { request, response } from "express";
import conn from "../database/dbConnection.js";
import { v4 } from "uuid";
import { uploadPicture } from "../tools/cloudinary.js";
import fs from 'fs-extra';
import { logOut } from "../controllers/auth.controller.js";

class PostModel {
    constructor() {

    }

    static async getPosts(req = request, res = response) {
        try {
            const [posts] = await conn.query('select * from posts where post_state = ?',
            [true]);
            return res.status(200).json({
                posts
            });


        } catch (err) {
            console.log(err, `=> server has failed`);
            return res.status(500).json({
                message: 'Server has failed, an error has ocurred'
            })
        }
    }

    static async getPost(req = request, res = response) {
        try {
            const { post_id } = req.body;
            if (!post_id) {
                return res.status(400).json({
                    message: 'post_id is required'
                })
            }
            const [post] = await conn.query(`
            select * 
            from(
            select * 
            from posts
            where post_id = ?
            )as posts 
            where post_state = ?;`,
                [post_id,true]);

            if (post.length < 1) {
                return res.status(200).json({
                    message: `This post isn't exist`
                })
            }

            return res.status(200).json({
                post
            });
        } catch (err) {
            console.log(err, `=> server has failed`);
            return res.status(500).json({
                message: 'Server has failed, an error has ocurred'
            })
        }
    }

    static async createPost(req = request, res = response) {
        try {
            const { description, location, precio } = req.body;


            const post_id = v4();

            const { user_id } = req.user;

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
                const { tempFilePath } = req.files[clave];
                const { secure_url, public_id } = await uploadPicture(tempFilePath);
                await conn.query(`insert into pictures set 
                  pic_id = ?, 
                  url = ?, 
                  post_id = ?;`, [public_id, secure_url, post_id]);
                fs.unlink(tempFilePath); // elimina los archivos temporales despues de cada insercion
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
    static async updatePost(req = request, res = response) {
        try {
            const { description, location, precio } = req.body;
            const { post_id } = req.params;
            const { user_id } = req.user;

            if (!user_id) {
                return res.status(200).json({
                    message: 'Not authorized'
                })
            }//verifica si el usuario inicio sesion

            const [postFind] = await conn.query(`select * from posts where post_id = ?`,
                [post_id]);

            if (postFind.length < 1) {
                return res.status(400).json({
                    message: `This post isn't exist or has been already deleted`
                })
            }// verifica si el post existe

            await conn.query(`update posts set
            description = ?,
            location = ?,
            precio = ?,
            post_date = now()
            where post_id = ?
            `, [description, location, precio, post_id]); //realiza la actualizacion usando en el id del post

            return res.status(201).json({
                message: 'Update has been successfully'
            });

        } catch (err) {
            console.log(err, '=> Server error');
            return res.status(500).json({
                message: 'Server has failed, an error has ocurred'
            });
        }
    }

    static async deletePost(req = request, res = response) {
        try {
            const { post_id } = req.params;
            const { user_id } = req.user;

            if (!user_id) {
                return res.status(200).json({
                    message: 'Not authorized'
                })
            }//verifica si el usuario inicio sesion

            const [postFind] = await conn.query(`select * from posts where post_id = ?`,
                [post_id]);

            if (postFind.length < 1) {
                return res.status(400).json({
                    message : `This post isn't exist`
                })
            }

            if (postFind[0].post_state == false) {
                return res.status(400).json({
                    message: `This post has been already deleted`
                })
            }// verifica si el post existe

            if(postFind[0].user_id != user_id){
                return res.status(401).json({
                    message : 'You do not authorized for this action'
                })
            }// verifica si el post pertenece al usuario

            await conn.query(`update posts set post_state = ? where post_id = ?`,
                [false, post_id]);// actualiza el estado del registro a falso

            return res.status(201).json({
                message: 'Post has been deleted successfully'
            })

        } catch (err) {
            console.log(err, '=> Server error');
            return res.status(500).json({
                message: 'Server failed, an error has ocurred'
            });
        }
    }
}

export default PostModel;