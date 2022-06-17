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
// checks between the actual and expected parameters by deep equality.
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
// checks that async func doesn't reject promise.
(async () => {
    await assert.doesNotReject(async() => {
        // throw new SyntaxError('SyntaxError');
    }, SyntaxError);
})();

// assert.doesNotThrow
(() => {
    assert.doesNotThrow(() => {
        // throw new TypeError('type error');
    }, /type error/, 'hoge!');
})();

// assert.fail
// throws AssertionError with error message.
// if error message is not setted, default message used.
// if Error instance is setted, it is thrown.
(() => {
    // assert.fail();
    // AssertionError [ERR_ASSERTION]: Failed

    // assert.fail('fail!');
    // AssertionError [ERR_ASSERTION]: fail!

    // assert.fail(new TypeError('type error'));
    // TypeError: type error
})();

// assert.ifError
// throws AssertionError, if value setted to arg is not null or undefined.
(() => {
    assert.ifError(null);

    // assert.ifError(100);
    // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 100

    // assert.ifError('test');
    // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'test'

    // assert.ifError(new TypeError());
    // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: TypeError
})();

// assert.match
// checks input string value match RegExp.
(() => {
    // assert.match('test', /abc/);
    // AssertionError [ERR_ASSERTION]: The input did not match the regular expression /abc/. Input: 'test'

    // assert.match(100, /abc/);
    // AssertionError [ERR_ASSERTION]: The "string" argument must be of type string. Received type number (100)

    assert.match('test', /te/);
})();

// assert.notDeepStrictEqual
// opposite of assert.deepStrictEqual()
(() => {
    const a = {name: 100};
    const b = {name: '100'};
    const c = {name: 100};

    assert.notDeepStrictEqual(a, b);

    // assert.notDeepStrictEqual(a, c);
    // AssertionError [ERR_ASSERTION]: Expected "actual" not to be strictly deep-equal to: { name: 100 }
})();

// assert.notStrictEqual
// opposite of assert.assert.strictEqual()
(() => {
    assert.notStrictEqual(1, '1');

    // assert.notStrictEqual(1, 1);
    // AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 1
})();

// assert.ok
// checks if the value is truthy.
// `assert()` is alias of `assert.ok()`.
(() => {
    assert.ok(true);
    assert.ok(1);
    assert.ok('test');
    assert.ok([]);
    assert.ok({});
    assert.ok(new Error);

    // assert.ok();
    // AssertionError [ERR_ASSERTION]: No value argument passed to `assert.ok()`

    // AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
    // assert.ok(false);
    // assert.ok('');
    // assert.ok(0);
})();

// assert.rejects
// throws Error if Promise don't reject or async fun don't return reject.
(async () => {
    await assert.rejects(async () => {
        throw new TypeError('Wrong value');
    });

    assert.rejects(Promise.reject('promise reject.'));

    // await assert.rejects(async() => {
    //     return 100;
    // });
    // AssertionError [ERR_ASSERTION]: Missing expected rejection.
})();

// assert.strictEqual
// checks if the result which Object.is compared the assert and expect value is true.
(() => {
    assert.strictEqual(1, 1);

    // assert.strictEqual(1, '1');
    // AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== '1'
})();

// assert.throws
// checks if the callback throws an error.
(() => {
    assert.throws(() => {
        throw new Error('error.');
    }, Error);

    // assert.throws(() => {
    //     return 100;
    // }, Error);
    // AssertionError [ERR_ASSERTION]: Missing expected exception (Error).

    // assert.throws(
    //     () => {
    //         throw new Error('Wrong value');
    //     },
    //     /^Error: test$/
    // );
    // AssertionError [ERR_ASSERTION]: The input did not match the regular expression /^Error: test$/. Input:'Error: Wrong value'
})();
