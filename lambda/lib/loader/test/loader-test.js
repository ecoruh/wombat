const assert = require('assert');
const loader = require('../loader');
const path = require('path');
const dir = path.dirname(__dirname);
require('dotenv').config({path: dir});

describe('loader test', () => {

  it('loader happy', done => {
    const hash = '27dd93c275e58c010c6f5d1f67ea63a102456237f2fdf9b382f13bb5f7a0846d';
    let book = loader.loadBook(`${__dirname}/sample`, hash);
    assert(book, 'obj should have ben deciphered');
    assert(book.contents.length === 5, 'should have 5 rows');
    assert(book.contents[3].value === 'fred', 'should have right value');
    console.log(book);
    done();
  });

});
