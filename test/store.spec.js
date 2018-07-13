/* global beforeEach, it */
/* eslint max-len: "off" */

const assert = require('assert');
const store = require('../dist/store').store;

describe('Store testing', function () {
  const baseState = {
    str: 'string',
    num: 10,
    obj: {
      prop: 'str',
      deepObj: {
        prop: 'bob'
      },
      deepArray: [4, 5, 6]
    },
    arr: [1, 2, 3]
  };

  beforeEach(function () {
    store.state = baseState;
  });

  it('store.state should deep equal baseState', function (done) {
    assert.deepStrictEqual(store.state, baseState);

    done();
  });

  it('store.state should be a copy of the store', function (done) {
    const copy = store.state;

    assert.deepStrictEqual(store.state, copy);
    assert.notStrictEqual(store.state, copy);

    done();
  });

  it('assigning store.state to a non object literal should throw an error', function (done) {
    assert.throws(
      () => store.state = 123, 
      (err) => err.message === '"state" property must be an object literal.'
    );
    done();
  });

  it('assigning store.state to an object should extend the store', function (done) {
    const extendObj = {
      newProp: {a: 'ok'}
    };

    store.state = extendObj;

    assert.deepStrictEqual(store.newProp, extendObj.newProp);
    assert.deepStrictEqual(store.state.newProp, extendObj.newProp);

    delete store.newProp;

    done();
  });

  it('assigning store.state to an object with existing properties should override those properties in the store', function (done) {
    const extendObj = {
      str: 123
    };

    store.state = extendObj;

    assert.deepStrictEqual(store.newProp, extendObj.newProp);
    assert.deepStrictEqual(store.state.newProp, extendObj.newProp);
    done();
  });

  it('store.state return value should be mutable without updating store', function (done) {
    const copy = store.state;
    copy.str = 123;

    assert.strictEqual(copy.str === 123, true);
    // check that store has not been updated
    assert.strictEqual(store.state.str === baseState.str, true);

    done();
  });

  it('directly modifying deep properties does not change the store', function (done) {
    store.obj.prop = 123;
    store.obj.deepObj.prop = 123;

    assert.deepStrictEqual(store.state, baseState);
    done();
  });

  it('modifying a copy of a top level property does not change the store', function (done) {
    const copy = store.obj;
    copy.prop = 123;

    assert.notStrictEqual(copy.prop, store.obj.prop);
    done();
  });

  it('modifying a copy of a top level property and setting the property updates the store', function (done) {
    const copy = store.obj;
    copy.prop = 123;

    store.obj = copy;

    assert.strictEqual(copy.prop, store.obj.prop);
    assert.strictEqual(copy.prop, store.state.obj.prop);
    done();
  });
});


// describe(suite.description, function () {
//   suite.tests.forEach(function (test) {
//     it(test.description, function () {
//       assert.strictEqual(fastEqual(test.value1, test.value2), test.equal);
//     });
//   });
// });
