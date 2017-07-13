var jwt = require('jsonwebtoken');

// Tets validity of JWT token
exports.validToken = token => {
  try {
    return jwt.verify(token, process.env.SECRET2);
  } catch (err) {
    return false;
  }
};