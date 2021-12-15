const jwt = require('jsonwebtoken');
const { promisify } = require('util');

class AuthMiddleware {
  static async validate(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }

    const [, token] = authorization.split(' ');

    try {
      await promisify(jwt.verify)(token, 'secret');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }
}

module.exports = AuthMiddleware;
