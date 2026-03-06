const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
      // On vérifie si le header existe avant de split
      if (!req.headers.authorization) {
        throw new Error('Token absent');
      }
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      req.auth = { userId: userId };
      next();
    } catch (error) {
      // On renvoie une erreur claire
      res.status(401).json({ error: error.message || 'Requête non authentifiée' });
    }
};