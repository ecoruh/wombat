const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to generate secret codes: ', (answer) => {

  console.log(`> password: ${answer}`);
  console.log('> GENERATING HASH...');
  console.log('  SECRET: ' + process.env.SECRET1);
  const secret = process.env.SECRET1;
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
  const cipher = crypto.createCipher('aes192', hash);
  let encrypted = cipher.update(JSON.stringify(dataJson), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  fs.writeFileSync('../' + process.env.ENCFILE, encrypted, { encoding: 'utf8' });

  // SECRET1
  // SECRET2
  // HASH
  // ENCFILE
  // REACT_PATH

  console.log('> CREATING ENV FILES..')
  let env = '';
  env += 'SECRET1=' + process.env.SECRET1 + '\n';
  env += 'SECRET2=' + process.env.SECRET2 + '\n';
  env += 'HASH=' + hash + '\n';
  env += "ENCFILE=" + process.env.ENCFILE + "\n";

  let suffix = "REACT_PATH=../build";
  fs.writeFileSync('../.env', env + suffix, { encoding: 'utf8' });

  rl.close();
});

