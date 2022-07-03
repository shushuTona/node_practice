const async_hooks = require('node:async_hooks');
const { nextTick } = require('node:process');

console.log(
    async_hooks.executionAsyncId(), // 1
    async_hooks.executionAsyncResource(), // {}
    async_hooks.triggerAsyncId() // 0
);

const status = [];
const asyncHook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
        status.push({
            name: 'init',
            asyncId, type, triggerAsyncId, resource
        });
    },
    before(asyncId) {
        status.push({
            name: 'before',
            asyncId
        });
    },
    after(asyncId) {
        status.push({
            name: 'after',
            asyncId
        });
    },
    destroy(asyncId) {
        status.push({
            name: 'destroy',
            asyncId
        });
    }
}).enable();

nextTick(() => {
    console.log("\n");
    console.log(status);
    console.log(
        async_hooks.executionAsyncId(), // 7
        async_hooks.executionAsyncResource(),
        // {
        //     callback: [Function (anonymous)],
        //     args: undefined,
        //     [Symbol(async_id_symbol)]: 7,
        //     [Symbol(trigger_async_id_symbol)]: 1
        // }
        async_hooks.triggerAsyncId() // 1
    );
});

queueMicrotask(() => {
    console.log("\n");
    console.log(status);
    console.log(
        async_hooks.executionAsyncId(), // 8
        async_hooks.executionAsyncResource(),
        // AsyncResource {
        //     callback: [Function (anonymous)],
        //     [Symbol(async_id_symbol)]: 8,
        //     [Symbol(trigger_async_id_symbol)]: 1
        // }
        async_hooks.triggerAsyncId() // 1
    );
});

console.log(status);
