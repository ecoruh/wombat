const AWS = require('aws-sdk');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();
AWS.config.update({ region: `${process.env.REGION}` });
const kms = new AWS.KMS();

let numargs = process.argv.length - 2;
if (numargs < 1) {
  console.log("Supply input file name (no extension)");
  console.log(`Usage: node app infile`);
  process.exit(-1);
}

const inFile = process.argv[2];

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const encryptHash = (fileName, hash) => {
  let params = {
    KeyId: `${process.env.KEYID}`,
    KeySpec: 'AES_256'
  };
  let key;
  let datakey;
  return kms.generateDataKeyWithoutPlaintext(params).promise()
    .then(data => {
      let arr = data.KeyId.split('/');
      datakey = arr[1];
      return true;
    })
    .then(() => {
      key = crypto.createHmac('sha256', hash)
        .update(datakey)
        .digest('hex');
      return true;
    })
    .then(() => kms.encrypt({ KeyId: datakey, Plaintext: key }).promise())
    .then(encrypted => fs.writeFileSync(`../${fileName}`, encrypted.CiphertextBlob))
    .then(() => kms.encrypt({ KeyId: datakey, Plaintext: hash }).promise())
    .then(encrypted => fs.writeFileSync('../hash', encrypted.CiphertextBlob))
    .then(() => key);
}

const encryptFile = (fileName, hash) => {
  console.log('> READING TAB FILE..');
  var contents = fs.readFileSync(`${fileName}.tab`, { encoding: 'utf8' });
  var dataTab = contents.trim().split(/\t|\n/);
  var dataJson = { contents: [] }
  dataTab.forEach(function (element, index, arr) {
    if (!index || !(index % 2)) {
      dataJson.contents.push({ id: index + 1, name: element, value: arr[index + 1] });
    }
  });
  console.log('> ENCRYPTING TAB FILE..');
  return encryptHash(fileName, hash)
    .then(key => {
      const cipher = crypto.createCipher('aes192', key);
      let encrypted = cipher.update(JSON.stringify(dataJson), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      fs.writeFileSync(`../${fileName}.enc`, encrypted);
      console.log('> ENCRYPTED TAB FILE..');
      return Promise.resolve();
    })
    .catch(err => console.error(err));
}

rl.question('Enter password to generate secret codes: ', (answer) => {

  console.log(`> password: ${answer}`);
  console.log('> GENERATING HASH...');
  console.log('  PEAS: ' + process.env.PEAS1);
  const hash = crypto.createHmac('sha256', process.env.PEAS1)
    .update(answer)
    .digest('hex');
  console.log('  HASH: ' + hash);

  encryptFile(inFile, hash)
    .then(() => {
      console.log('> CREATING ENV FILES..')
      let env = '';
      env += 'PEAS1=' + process.env.PEAS1 + '\n';
      env += 'PEAS2=' + process.env.PEAS2 + '\n';
      env += 'HASH=' + hash + '\n';
      env += "ENCFILE=" + `${inFile}.enc` + "\n";
      env += "KEYID=" + process.env.KEYID + "\n";
      env += "REGION=" + process.env.REGION + "\n";
      let suffix = "REACT_PATH=../build";
      fs.writeFileSync('../.env', env + suffix, { encoding: 'utf8' });
      rl.close();
      });
    rl.close();
});

