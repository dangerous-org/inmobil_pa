import { request, response } from "express";
import conn from "../database/dbConnection.js";
import { v4 } from "uuid";
import { uploadPicture } from "../tools/cloudinary.js";
import fs from "fs-extra";

class PostModel {
  constructor() { }

  static async getPosts(req = request, res = response) {
    try {
      const [posts] = await conn.query(
        "select * from posts where post_state = ?",
        [true]
      ); // Obtiene todos los post que esten activos
      return res.status(200).json({
        posts,
      });
    } catch (err) {
      console.log(err, `=> server has failed`);
      return res.status(500).json({
        message: "Server has failed, an error has ocurred",
      });
    }
  }

  static async getPost(req = request, res = response) {
    try {
      const { post_id } = req.params;
      if (!post_id) {
        return res.status(400).json({
          message: 'post_id is required'
        });
      }
      const [post] = await conn.query(`call getPostById(?)`,
        [post_id]); // Busca en la base de datos un post que coincida con el id y obtiene toda su informacion

      if (post[0].length < 1) {
        return res.status(200).json({
          message: `This post isn't exist`
        });
      }// verifica si encontro algun post

      return res.status(200).json({
        post: post[0]
      });// Devuelve toda la informacion relacionada al post
    } catch (err) {
      console.log(err, `=> server has failed`);
      return res.status(500).json({
        message: 'Server has failed, an error has ocurred'
      });
    }
  }

  static async getPics(req = request, res = response) {
    try {
      const { post_id } = req.params;
      if (!post_id) {
        return res.status(400).json({
          message: 'post_id is required'
        });
      } // verifica si el post existe
      const [pics] = await conn.query(`call getPics(?)`,
        [post_id]); // Obtiene todas las fotos cargadas para este post

      if (pics[0].length < 1) {
        return res.status(200).json({
          message: `pics are not uploaded`
        }); // verifica si hay fotos cargadas para este post
      }
      return res.status(200).json({
        pics: pics[0]
      }); // devuelve la url e id de todas las fotos
    } catch (err) {
      console.log(err, `=> server has failed`);
      return res.status(500).json({
        message: 'Server has failed, an error has ocurred'
      });
    }
  }

  static async createPost(req = request, res = response) {
    try {
      const { description, location, precio, type } = req.body;

      const post_id = v4();

      const { user_id } = req.user;

      console.log(req.files);
      if (!user_id) {
        return res.status(400).json({
          message: "Not authorized",
        });
      } //Verifica si el usuario ya inicio sesion

      await conn.query("insert into posts(post_id,description,location,price,type,user_id) values(?,?,?,?,?,?)",
        [
          post_id,
          description,
          location,
          precio,
          type,
          user_id
        ]); // Realiza la insercion en la tabla posts

      for (const clave in req.files) {
        const { tempFilePath } = req.files[clave];
        const { secure_url, public_id } = await uploadPicture(tempFilePath);
        await conn.query(
          `insert into pictures set 
                  pic_id = ?, 
                  url = ?, 
                  post_id = ?;`,
          [public_id, secure_url, post_id]
        );
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
      const { description, location, precio, type } = req.body;
      const { post_id } = req.params;
      const { user_id } = req.user;

      if (!user_id) {
        return res.status(200).json({
          message: "Not authorized",
        });
      } //verifica si el usuario inicio sesion

      const [postFind] = await conn.query(
        `select * from posts where post_id = ?`,
        [post_id]
      );

      if (postFind.length < 1) {
        return res.status(400).json({
          message: `This post isn't exist or has been already deleted`,
        });
      } // verifica si el post existe

      await conn.query(
        `update posts set
            description = ?,
            location = ?,
            price = ?,
            post_date = now(),
            type = ?
            where post_id = ?
            `, [description, location, precio, type, post_id]); //realiza la actualizacion usando en el id del post

      return res.status(201).json({
        message: "Update has been successfully",
      });
    } catch (err) {
      console.log(err, "=> Server error");
      return res.status(500).json({
        message: "Server has failed, an error has ocurred",
      });
    }
  }

  static async deletePost(req = request, res = response) {
    try {
      const { post_id } = req.params;
      const { user_id } = req.user;

      if (!user_id) {
        return res.status(200).json({
          message: "Not authorized",
        });
      } //verifica si el usuario inicio sesion

      const [postFind] = await conn.query(
        `select * from posts where post_id = ?`,
        [post_id]
      );

      if (postFind.length < 1) {
        return res.status(400).json({
          message: `This post isn't exist`,
        });
      }

      if (postFind[0].post_state == false) {
        return res.status(400).json({
          message: `This post has been already deleted`,
        });
      } // verifica si el post existe

      if (postFind[0].user_id != user_id) {
        return res.status(401).json({
          message: "You do not authorized for this action",
        });
      } // verifica si el post pertenece al usuario

      await conn.query(`update posts set post_state = ? where post_id = ?`, [
        false,
        post_id,
      ]); // actualiza el estado del registro a falso

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

  static async searchByType(req, res) {
    try {
      const { type } = req.body;
      if (!type) {
        return res.status(400).json({
          message: 'No type has been selected yet'
        });
      }
      const [postFind] = await conn.query('Select * from posts where type = ?', [type]);

      return res.status(200).json({
        postFind
      })
    } catch (err) {

    }
  }
}
export default PostModel;
