const jwt = require('jsonwebtoken');
const { promisify } = require('util');

class CompanyMiddleware {
  static async validate(req, res, next) {
    const { authorization, type } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }

    if (type !== '0') {
      return res.status(401).json({ message: 'Acesso não permitido' });
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

module.exports = CompanyMiddleware;
