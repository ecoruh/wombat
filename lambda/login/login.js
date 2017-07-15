'use strict';

const api = require('../lib/api');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.endpoint = (event, context) => {
  var login = JSON.parse(event.body);

  if (!login.password) {
    return api.error(context, 400, 'Invalid properties');
  }

  const hash = crypto.createHmac('sha256', process.env.SECRET1)
    .update(login.password)
    .digest('hex');
  if (hash === process.env.HASH) {
    // if password is right create a token
    let token = jwt.sign({ data: `${login.password}`}, process.env.SECRET2, {
      expiresIn: 60 * 60 // expires in 1 hour
    });
    api.succeed(context, {success: true, message: 'token', token: token});
    return;
  }
  api.error(context, 403, 'Forbidden');
};
