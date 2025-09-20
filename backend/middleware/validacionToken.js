const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token; 

    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado, token requerido" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next(); 
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
