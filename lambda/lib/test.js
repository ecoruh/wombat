require('dotenv').config();
var jwt = require('jsonwebtoken');

exports.getJWT = () => {
  let token = jwt.sign({ data: `${process.env.PASSWORD}` }, process.env.SECRET2, {
    expiresIn: 60 * 60 // expires in 1 hour
  });
  return token;
};