import jwt from "jsonwebtoken";

//esta funcion fue creada para generar o crear un jsonwebtoken (jwt)

const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    // devolvemos una promesa
    jwt.sign(// metodo para generar el token
      payload, // informacion que quieres guaradar en el token
      process.env.SECRET_KEY, // clave secreta para crear el token
      { expiresIn: "1h" }, // tiempo de expiracion del token ( 1 hora)
      (error, token) => {
        // calback para ver si hay un error o resolver el token
        if (error) {
          reject(error);
        }
        resolve(token);
      }
    );
  });
};

export default generateJWT;