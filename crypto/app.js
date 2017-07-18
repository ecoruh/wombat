const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

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

encryptFile = (fileName, hash) => {
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
  const cipher = crypto.createCipher('aes192', hash);
  let encrypted = cipher.update(JSON.stringify(dataJson), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  fs.writeFileSync(`../${fileName}.enc`, encrypted);

}

rl.question('Enter password to generate secret codes: ', (answer) => {

  console.log(`> password: ${answer}`);
  console.log('> GENERATING HASH...');
  console.log('  SECRET: ' + process.env.SECRET1);
  const hash = crypto.createHmac('sha256', process.env.SECRET1)
    .update(answer)
    .digest('hex');
  console.log('  HASH: ' + hash);
  const wombat = crypto.createHmac('sha256', process.env.SECRET2)
    .update(hash)
    .digest('hex');
  console.log('  WOMBAT: ' + wombat);

  encryptFile(inFile, hash);

  let contents = `# serverless.env.yml
dev:
  ORIGIN: ${process.env.ORIGIN}
  BUCKET: ${process.env.BUCKET}
  REGION: ${process.env.REGION}
  SECRET1: ${process.env.SECRET1}
  SECRET2: ${process.env.SECRET2}
  WOMBAT: ${wombat}
  FILE: ${inFile}
  HASH: ${hash}
`;
  fs.writeFileSync('../serverless.env.yml', contents, { encoding: 'utf8' });

  rl.close();

  if (inFile === 'sample') {
    contents = `SECRET1=${process.env.SECRET1}
SECRET2=${process.env.SECRET2}
HASH=${hash}
FILE=${inFile}
PASSWORD=${answer}
`;
    fs.writeFileSync('../.env', contents, { encoding: 'utf8' });

    rl.close();
  }
});

