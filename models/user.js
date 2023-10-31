import { v4 } from "uuid";
import conn from "../database/dbConnection.js";
import bcrypt from "bcrypt";
import { response, request } from "express";
import generateJWT from "../tools/generate-jwt.js";

class UserModel {
    constructor() {
    }

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
            const passCrypted = await bcrypt.hash(password, 10); // encriptar contraseña con bcrypt

            // Mandar query a la base de datos
            const result = await conn.query(
                "insert into users (user_id,user,password,email) values(?,?,?,?);",
                [user_id, user, passCrypted,email]
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
        const { email, password } = req.body; // Desestructurar el formulario
    
        // Desestructuramos el arreglo para obtener los datos del usuario a buscar
        const [userFound] = await conn.query(
          "Select * from users where email = ? ;",
          [email]
        );
    
        if (userFound.length < 1) {
          return res.status(404).json({ error: "User doesn't exists" });
        } // en caso de que no se encuentre el usuario se enviara un error 404
    
        const passCrypted = userFound[0].password;
        res.locals.user_id = userFound[0].user_id;
    
        // Si el usuario es encontrado se compararan la contraseña y la contraseña encriptada
        const isMatch = await bcrypt.compare(password, passCrypted);
    
        if (!isMatch) {
          return res.status(500).json({ error: "incorrect password" });
        } // si no son iguales se enviara mensaje diciendo que la contraseña es incorrecta
    
        const token = await generateJWT({ user_id: userFound[0].user_id }); // se llama al metodo para generar un nuevo token
        res.cookie("authToken", token); // se asigna el nuevo token aun cookie
        
        // En caso de que pase todas las validaciones se enviara un codigo de estado 200 y su id junto el usuario
        return res.status(200).json({
          id: userFound[0].user_id,
          user: userFound[0].user,
          email: userFound[0].email
        });
      }
}

export default UserModel;
