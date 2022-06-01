// Strict assertion mode
// error message for object display a diff.(legacy one display a object.)
const assert = require('node:assert/strict');

// new assert.AssertionError(options)
// generate assertion error that is a subclass of Error.
(() => {
    const assertionError = new assert.AssertionError({
        actual: 100,
        expected: '100',
        operator: 'strictEqual',
    });

    try {
        assert.strictEqual(100, '100');
    } catch(err) {
        assert(err instanceof assert.AssertionError);
        assert.strictEqual(err.message, assertionError.message);
        assert.strictEqual(err.actual, assertionError.actual);
        assert.strictEqual(err.expected, assertionError.expected);
        assert.strictEqual(err.operator, assertionError.operator);
    }
})();

// assert.CallTracker
// https://github.com/nodejs/node/blob/v18.2.0/lib/internal/assert/calltracker.js
// * experimental feature
// generate tracker object that is used to track if functions were called a specific number of times.
(() => {
    const tracker = new assert.CallTracker();

    const testFunc = () => {
        console.log('testFunc');
    }

    // callsFunc must be called exactly 1 time before execute tracker.verify.
    // → an error will occur if it is not called or is called multiple times.
    const callsFunc = tracker.calls(testFunc, 1);

    callsFunc();

    // check if tracker.calls have been called exact number of times.
    process.on('exit', () => {
        // tracker.report is called in inner of tracker.verify() and create error array.
        tracker.verify();
    })
})();

// assert.deepStrictEqual
// check between the actual and expected parameters by deep equality.
// * In strict mode, assert.deepEqual is a alias of assert.deepStrictEqual.
//
// compare the actual and expected parameters by isDeepStrictEqual(internal/util/comparisons.isDeepStrictEqual).
(() => {
    // Primitive values are compared using Object.is().
    assert.deepStrictEqual(NaN, NaN);

    // [[Prototype]] of objects are compared using the === operator.
    const obj = {};
    const fakeObj = {};
    const num = new Number();
    // Object.setPrototypeOf(fakeObj, Number.prototype);
    // assert.deepStrictEqual(obj, fakeObj);
    // + {}
    // - Number {}

    // assert.deepStrictEqual(num, fakeObj);
    // + [Number: 0]
    // - Number {}
})();

// assert.doesNotMatch
// when input string doesn't match expected regexp, assert.doesNotMatch returns true.
(() => {
    // assert.doesNotMatch('abcdefg', /abc/);
    // [ERR_ASSERTION]: The input was expected to not match the regular expression /abc/. Input:'abcdefg'

    assert.doesNotMatch('abcdefg', /xyz/);
})();

// assert.doesNotReject
// check that async func doesn't reject promise.
(async () => {
    await assert.doesNotReject(async() => {
        throw new SyntaxError('SyntaxError');
    }, SyntaxError);
})();
