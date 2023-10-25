import { v4 } from "uuid";
import { response, request } from "express";
import bcrypt from "bcrypt";
import conn from "../database/dbConnection.js";
import generateJWT from "../tools/generate-jwt.js";

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
        return res.status(404).json({ error: "User doesn't exists" });
      } // en caso de que no se encuentre el usuario se enviara un error 404

      const passwordCrypted = userFound[0].password;

      // Si el usuario es encontrado se compararan la contraseña y la contraseña encriptada
      const isMatch = await bcrypt.compare(password, passwordCrypted);

      if (!isMatch) {
        return res.status(500).json({ error: "incorrect password" });
      } // si no son iguales se enviara mensaje diciendo que la contraseña es incorrecta

      const token = await generateJWT({ user_id: userFound[0].user_id }); // se llama al metodo para generar un nuevo token
      res.cookie("authToken", token); // se asigna el nuevo token aun cookie

      // En caso de que pase todas las validaciones se enviara un codigo de estado 200 y su id junto el usuario
      return res.status(200).json({
        id: userFound[0].user_id,
        user: userFound[0].user,
        email: userFound[0].email,
      });
    } catch (error) {
      console.log(error, "sign in");
    }
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
          .json({ error: `an user is already using username: ${user}` });
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
}

export default authModel;
