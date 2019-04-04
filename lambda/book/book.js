const AWS = require('aws-sdk');
const fs = require('fs');
const api = require('../lib/api');
const security = require('../lib/security')
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
AWS.config.update({ region: `${process.env.REGION}` });
const kms = new AWS.KMS();

exports.endpoint = (event, context) => {
  var token = event.headers.Authorization;
  if (!security.validToken(token)) {
    return api.error(context, 400, 'Bad request'); 
  }
  let encryptedKey = fs.readFileSync(`${process.env.FILE}`);
  kms.decrypt({ CiphertextBlob: encryptedKey }).promise()
    .then(decryptedKey => {
      const decipher = crypto.createDecipher('aes192', decryptedKey.Plaintext);
      let encrypted = fs.readFileSync(process.env.FILE + '.enc', { encoding: 'utf8' });
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      let decryptedObj = JSON.parse(decrypted);
      decryptedObj.contents.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return api.succeed(context, decryptedObj.contents);c
    })
    .catch(err => api.error(context, 503, JSON.stringify(err)));  
};
