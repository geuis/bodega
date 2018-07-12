const assert = require('assert');
const {fastEqual} = require('../dist/util/fast-deep-equal');
const fastEqualTests = require('./fast-equal');

describe('fastEqual', function () {
  fastEqualTests.forEach(function (suite) {
    describe(suite.description, function () {
      suite.tests.forEach(function (test) {
        it(test.description, function () {
          assert.strictEqual(fastEqual(test.value1, test.value2), test.equal);
        });
      });
    });
  });
});
