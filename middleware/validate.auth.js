import jwt from "jsonwebtoken";
const validateAuth = (req, res, next) => {
  const { authToken } = req.cookies;
  if (!authToken) return res.status(401).json({ message: "unauthorized" });
  jwt.verify(authToken, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    req.user = user;
  });
  next();
};

export default validateAuth;
