const assert = require('assert');
const login = require('../login');
require('dotenv').config();

describe('test login', () => {
  
  it('test login (happy)', (done) => {
    const body = { password: 'abc123'};
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }      
    }
    const context = {
      succeed: response => {
        assert(response.statusCode === 200, 'should succeed');
        let obj = JSON.parse(response.body);
        assert(obj.message === 'token', 'should have token');
        console.log(obj.token);
        done();
      }
    };
    login.endpoint(event, context);
  });

  it('test login (not happy)', (done) => {
    const body = { password: 'wrong'};
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }      
    }
    const context = {
      succeed: response => {
        let obj = JSON.parse(response.body);
        assert(!obj.success, 'should NOT succeed');
        done();
      }
    };
    login.endpoint(event, context);
  });
  
  it('test login (no password)', (done) => {
    const body = {};
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }      
    }
    const context = {
      succeed: response => {
        assert(response.statusCode === 400, 'no password should fail');
        done();
      }
    };
    login.endpoint(event, context);
  });

});