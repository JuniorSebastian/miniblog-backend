const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: parseInt(decoded.userId), // asegúrate que es número (requerido por Prisma)
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('❌ Token inválido:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { verifyToken };
