import jwt from "jsonwebtoken";

//  este middleware fue creada para veficar un token, usado para extraer la info del token
// y a la vez para validar que se puedan o no acceder a otras rutas

const validateAuth = (req, res, next) => {
  const { authToken } = req.cookies; //  extraemos el token de las cookies (configurar el middleware "cookie-parser")
  if (!authToken) {
    return res.status(401).json({ errors: "unauthorized" });
  }// verificar si exioste el token

  jwt.verify(authToken, process.env.SECRET_KEY, (error, user) => {
    if (error) return res.status(403).json({ errros: "unauthorized" });
    req.user = user; // asignar el valor del token a un varibale
  });
  next();
};

export default validateAuth;