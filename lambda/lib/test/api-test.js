const assert = require('assert');
const api = require('../api');

describe('test api', (done) => {
  
  it('test success', (done) => {
    const context = {
      succeed: response => {
        let obj = JSON.parse(response.body);
        console.log(response.body);
        assert (response.statusCode === 200, 'status code should be ok');
        assert(obj.foo === 'fred', 'body should match');
        done();
      }
    }
    api.succeed(context, {foo: 'fred'});
  });

  it('test failure', (done) => {
    const context = {
      succeed: response => {
        let obj = JSON.parse(response.body);
        console.log(response.body);
        assert (obj.error.code === 500, 'status code should be 500');
        assert(obj.error.message === 'error', 'error message should match');
        done();
      }
    }
    api.error(context, 500, 'error');    
  });

});
