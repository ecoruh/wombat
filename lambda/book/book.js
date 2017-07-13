'use strict';

const fs = require('fs');
const api = require('../lib/api');
const security = require('../lib/security')
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.endpoint = (event, context) => {
  var token = event.headers.Authorization;
  console.log('**** book: ' + token);
  if (!security.validToken(token)) {
    return api.error(context, 400, 'Bad request'); // No detail here
  }

  const decipher = crypto.createDecipher('aes192', process.env.HASH);
  var encrypted = fs.readFileSync(process.env.FILE + '.enc', { encoding: 'utf8' });
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  var decryptedObj = JSON.parse(decrypted);
  decryptedObj.contents.sort(function (a, b) { return a.name.localeCompare(b.name); });

  api.succeed(context, decryptedObj.contents);
};
