const AWS = require('aws-sdk');
const fs = require('fs');
const api = require('../lib/api');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
AWS.config.update({ region: `${process.env.REGION}` });
const kms = new AWS.KMS();

exports.endpoint = (event, context) => {
  var login = JSON.parse(event.body);

  if (!login.password) {
    return api.error(context, 400, 'Invalid properties');
  }

  const hash = crypto.createHmac('sha256', process.env.PEAS1)
    .update(login.password)
    .digest('hex');

  let encryptedHash = fs.readFileSync('hash');
  kms.decrypt({ CiphertextBlob: encryptedHash }).promise()
    .then(decryptedHash => {
      if (hash === decryptedHash.Plaintext.toString()) {
        // if password is right create a token
        let token = jwt.sign({ data: `"${process.env.WOMBAT}"` }, process.env.PEAS2, {
          expiresIn: 60 * 60 // expires in 1 hour
        });
        return api.succeed(context, { success: true, message: 'token', token: token });
      } else {
        return api.succeed(context, { success: false, message: 'Authentication failed! Wrong password!' });
      }      
    });
};
