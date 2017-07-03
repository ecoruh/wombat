'use strict';

const crypto = require('crypto');
const fs = require('fs');

exports.loadBook = (fileName, hash) => {
  const decipher = crypto.createDecipher('aes192', hash);
  var encrypted = fs.readFileSync(`${fileName}.enc`, { encoding: 'utf8' });
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  var decryptedObj = JSON.parse(decrypted);
  decryptedObj.contents.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return decryptedObj;
}
