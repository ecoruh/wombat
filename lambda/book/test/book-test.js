const assert = require('assert');
const book = require('../book');
const test = require('../../lib/test');
require('dotenv').config();

describe('book', (done) => {

  var jwt = "";

  before((done) => {
    jwt = test.getJWT();
    done();
  });

  it('happy', (done) => {
    const event = {
      httpMethod: 'GET',
      headers: { Authorization: jwt }
    };
    const context = {
      succeed: response => {
        var body = JSON.parse(response.body);
        console.log(response.body);
        assert(body.length === 5, 'must be an array');
        console.log(response.body);
        done();
      }
    };
    book.endpoint(event, context);
  });

  it('invalid token', (done) => {
    const event = {
      httpMethod: 'GET',
      headers: { Authorization: -1 }
    };
    const context = {
      succeed: response => {
        var body = JSON.parse(response.body);
        assert(body.error.code === 400, 'must be an error');
        console.log(response.body);  
        done();
      }
    };
    book.endpoint(event, context);
  });
});
