const port = process.env.PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const crypto = require('crypto');
const morgan = require('morgan');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const fs = require('fs');
require('dotenv').config();

var log = function (entry) {
  fs.appendFileSync('/tmp/app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

app.use(express.static(process.env.REACT_PATH));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.REACT_PATH, 'index.html'));
});

app.get('/protected', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.REACT_PATH, 'index.html'));
});

app.get('/public', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.REACT_PATH, 'index.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, process.env.REACT_PATH, 'index.html'));
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// POST password entry (GET http://localhost:3000/api/authenticate)
apiRoutes.post('/authenticate', function (req, res) {
  const hash = crypto.createHmac('sha256', process.env.SECRET1)
    .update(req.body.password)
    .digest('hex');
  if (hash === process.env.HASH) {
    // if password is right create a token
    var token = jwt.sign({ data: process.env.HASH }, process.env.SECRET2, {
      expiresIn: 60 * 60 // expires in 1 hour
    });

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    });
  } else {
    res.json({
      sucess: false,
      message: "Authentication failed! Wrong password!"
    });
  }
});

// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  // var token = req.body.token || req.query.token || req.headers['Authorization'];
  var token = req.headers['authorization'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET2, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

const decipher = crypto.createDecipher('aes192', process.env.HASH);
var encrypted = fs.readFileSync( '' + process.env.ENCFILE, { encoding: 'utf8' });
var decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
var decryptedObj = JSON.parse(decrypted);
decryptedObj.contents.sort( function(a, b) { return a.name.localeCompare(b.name); });

// route to return all items (GET http://localhost:3000/api/book)
apiRoutes.get('/book', function (req, res) {
  res.json(decryptedObj.contents);
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

console.log('express started at port: ' + port);
app.listen(port);

