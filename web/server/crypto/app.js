const AWS = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();
AWS.config.update({ region: `${process.env.REGION}` });
const kms = new AWS.KMS();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to generate secret codes: ', (answer) => {

  console.log(`> password: ${answer}`);
  console.log('> GENERATING HASH...');
  console.log('  PEAS: ' + process.env.PEAS1);
  const secret = process.env.PEAS1;
  const hash = crypto.createHmac('sha256', secret)
    .update(answer)
    .digest('hex');
  console.log('  HASH: ' + hash);

  console.log('> READING TAB FILE..');
  var contents = fs.readFileSync(process.env.CLRFILE, { encoding: 'utf8' });
  var dataTab = contents.trim().split(/\t|\n/);
  var dataJson = { contents: [] }
  dataTab.forEach(function (element, index, arr) {
    if (!index || !(index % 2)) {
      dataJson.contents.push({ id: index + 1, name: element, value: arr[index + 1] });
    }
  });

  console.log('> ENCRYPTING TAB FILE..');

  let params = {
    KeyId: `${process.env.KEYID}`,
    KeySpec: 'AES_256'
  };
  kms.generateDataKeyWithoutPlaintext(params).promise()
    .then(data => {
      let arr = data.KeyId.split('/');
      return arr[1];
    })
    .then(data => kms.encrypt({ KeyId: data, Plaintext: `${JSON.stringify(dataJson)}` }).promise())
    .then(data => fs.writeFileSync('../' + process.env.ENCFILE, data.CiphertextBlob))
    .then(() => {
      let contents = fs.readFileSync('../' + process.env.ENCFILE);
      return Promise.resolve({ PlaintextBlob: contents });
    })
    .then(data => kms.decrypt({ CiphertextBlob: data.PlaintextBlob }).promise())
    .then(data => console.log(JSON.stringify(data.Plaintext.toString())))
    .then(() => {
      console.log('> CREATING ENV FILES..')
      let env = '';
      env += 'PEAS1=' + process.env.PEAS1 + '\n';
      env += 'PEAS2=' + process.env.PEAS2 + '\n';
      env += 'HASH=' + hash + '\n';
      env += "ENCFILE=" + process.env.ENCFILE + "\n";
      env += "KEYID=" + process.env.KEYID + "\n";
      env += "REGION=" + process.env.REGION + "\n";
      let suffix = "REACT_PATH=../build";
      fs.writeFileSync('../.env', env + suffix, { encoding: 'utf8' });

      rl.close();
    });
});

