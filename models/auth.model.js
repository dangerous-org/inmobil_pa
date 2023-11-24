import { v4 } from "uuid";
import { response, request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import conn from "../database/dbConnection.js";
import generateJWT from "../tools/generate-jwt.js";
import googleVerify from "../tools/google-verify.js";
import { logOut } from "../controllers/auth.controller.js";
import { log } from "console";

class authModel {
  constructor() {}

  static async signup(req = request, res = response) {
    try {
      const { user, password, email } = req.body; // desesctrutuar el formulario

      const [userFound] = await conn.query(
        "select * from users where user = ? or email = ? ",
        [user, email]
      ); // veficar si ya existe un usuario con el username
      if (userFound.length > 0) {
        return res
          .status(400)
          .json({ message: "user or email already exists, try whit another" });
      }

      const user_id = v4(); //id autogenerado
      const passwordCrypted = await bcrypt.hash(password, 10); // encriptar contraseña con bcrypt

      // Mandar query a la base de datos
      const userCreated = await conn.query(
        "insert into users (user_id,user,password,email) values(?,?,?,?);",
        [user_id, user, passwordCrypted, email]
      );

      // crear su perfil de usuario
      const [profileCreated] = await conn.query(
        "insert into profiles (user_id, biography) values (?,?)",
        [user_id, ""]
      );
      // buscar su perfil de usuario
      const [profile] = await conn.query(
        "select * from profiles where user_id = ?",
        [user_id]
      );

      // si la peticion se cumple correctamente retorna un codigo de estado 200
      return res
        .status(201)
        .json({ message: "user has been created succesfully" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "500 || user could not be created" });
    } // en caso de generar algun error se envia al frontend
  }

  static async signIn(req = request, res = response) {
    try {
      const { email, password } = req.body; // Desestructurar el formulario

      // Desestructuramos el arreglo para obtener los datos del usuario a buscar
      const [userFound] = await conn.query(
        "Select * from users where email = ? ;",
        [email]
      );

      if (userFound.length < 1) {
        return res.status(400).json({ message: "User doesn't exists" });
      } // en caso de que no se encuentre el usuario se enviara un error 404

      const passwordCrypted = userFound[0].password;

      // Si el usuario es encontrado se compararan la contraseña y la contraseña encriptada
      const isMatch = await bcrypt.compare(password, passwordCrypted);

      if (!isMatch) {
        return res.status(400).json({ message: "incorrect password" });
      } // si no son iguales se enviara mensaje diciendo que la contraseña es incorrecta

      const token = await generateJWT({ user_id: userFound[0].user_id }); // se llama al metodo para generar un nuevo token
      res.cookie("authToken", token); // se asigna el nuevo token a una cookie

      const [profile] = await conn.query(
        "select * from profiles where user_id = ?",
        [userFound[0].user_id]
      );
      return res.status(200).json({
        user_id: userFound[0].user_id,
        user: userFound[0].user,
        email: userFound[0].email,
        photo: profile[0].foto,
        banner: profile[0].banner,
        biography: profile[0].biography,
      });
    } catch (error) {
      console.log(error, "sign in");
      return res.status(500).json({ message: "could not sign in" });
    }
  }

  static async googleAuth(req = request, res = response) {
    try {
      const { authToken } = req.body;
      const { payload } = await googleVerify(authToken);
      const { email, nbf } = payload;
      const [userFound] = await conn.query(
        "select * from users where email = ?",
        [email]
      );

      if (userFound && userFound.length > 0) {
        const [profile] = await conn.query(
          "select * from profiles where user_id = ?",
          [userFound[0].user_id]
        );
        console.log(profile);
        const user_id = userFound[0].user_id;
        const token = await generateJWT({ user_id });
        res.cookie("authToken", token);
        return res.status(200).json({
          user_id: userFound[0].user_id,
          user: userFound[0].user,
          email: userFound[0].email,
          photo: profile[0].foto,
          banner: profile[0].banner,
          biography: profile[0].biography,
        });
      }

      const user_id = v4();
      // crear usuario
      const userCreated = await conn.query(
        "insert into users (user_id, user, email, google_state) values(?,?,?,?)",
        [user_id, nbf, email, true]
      );
      // crear su perfil de usuario
      const [profileCreated] = await conn.query(
        "insert into profiles (user_id, biography) values (?,?)",
        [user_id, ""]
      );
      // buscar su perfil de usuario
      const [profile] = await conn.query(
        "select * from profiles where user_id = ?",
        [user_id]
      );

      // envio de datos al frontend
      const token = await generateJWT({ user_id });
      res.cookie("authToken", token);
      return res.status(201).json({
        user_id: user_id,
        user: nbf,
        email: email,
        photo: profile[0].foto,
        banner: profile[0].banner,
        biography: profile[0].biography,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "google auth could not be done" });
    }
  }

  static async verifyToken(req = request, res = response) {
    const { authToken } = req.cookies;
    if (!authToken) return res.status(401).json({ mesaage: "unauthorized" });
    jwt.verify(authToken, process.env.SECRET_KEY, async (err, user) => {
      if (err) return res.status(401).json({ messagee: "Unauthorized" });
      const [userFound] = await conn.query(
        "select * from users where user_id = ?",
        [user.user_id]
      );
      if (!userFound) return res.status(401).json({ messagee: "Unauthorized" });
      const [profile] = await conn.query(
        "select * from profiles where user_id = ?",
        [user.user_id]
      );
      return res.json({
        user_id: userFound[0].user_id,
        email: userFound[0].email,
        user: userFound[0].user,
        createdAt: userFound[0].created_at,
        photo: profile[0].foto,
        banner: profile[0].banner,
        biography: profile[0].biography,
      });
    });
  }

  static async updateUser(req = request, res = response) {
    try {
      const { user, password, email } = req.body; // recibir datos del form

      const [userFound] = await conn.query(
        "select user, email from users where user = ? and email <> ?",
        [user, email]
      );

      if (userFound.length > 0) {
        return res
          .status(401)
          .json({ message: `an user is already using username: ${user}` });
      }

      const passwordCrypted = await bcrypt.hash(password, 10); // encriptar la contraseña

      const user_id = req.user.user_id;

      const userUpdated = await conn.query(
        "update users set user = ?, password = ?, email = ? where user_id = ?",
        [user, passwordCrypted, email, user_id]
      ); // actualizar la info del user

      return res
        .status(201)
        .json({ message: "user has been updated succesfully" });
    } catch (error) {
      console.log(error, "=>update user");
      return res.status(500).json({ message: "user could not be updated" });
    }
  }

  static async followUser(req = request, res = response) {
    try {
      const { followed_id } = req.params;
      const { user_id } = req.user;
      const [userFound] = await conn.query(
        `select * from users where user_id = ? `,
        [followed_id]
      );

      if (userFound.length < 1) {
        return res.status(400).json({
          message: `User to follow isn't exist`,
        });
      }

      const [followFound] = await conn.query(
        `select * from following where user_id = ? AND seguido_id = ?`,
        [user_id, followed_id]
      );

      if (followFound.length != 0) {
        return res.status(400).json({
          message: "You are already follow this user",
        });
      }

      await conn.query(`insert into following values(?,?)`, [
        user_id,
        followed_id,
      ]);
      return res.status(201).json({
        message: "Now you are following this user",
      });
    } catch (err) {
      return res.status(500).json({
        message: "An error has ocurred",
      });
    }
  }

  static async unfollow(req = request, res = response) {
    try {
      const { followed_id } = req.params;
      const { user_id } = req.user;
      const [userFound] = await conn.query(
        `select * from users where user_id = ? `,
        [followed_id]
      );

      if (userFound.length < 1) {
        return res.status(400).json({
          message: `User to follow isn't exist`,
        });
      }

      await conn.query(
        `delete from following where user_id = ? AND seguido_id = ?`,
        [user_id, followed_id]
      );

      return res.status(200).json({
        message: "you have stopped following this user",
      });
    } catch (err) {
      return res.status(500).json({
        message: "An error has ocurred",
      });
    }
  }
}

export default authModel;
