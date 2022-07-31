'use strict';

const stream = require( 'node:stream' );

const writable = new stream.Writable( {
    // constructはnextTickで実行され、callbackが実行されるまで、_write(), _final(), _destroy()の処理を遅延させる。
    // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L260
    // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/destroy.js#L231
    construct ( callback ) {
        console.log('===== construct =====');

        // nextTickでの実行時にonConstructをcallbackとして実行
        // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/destroy.js#L275
        callback();
    },

    // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L240
    // this._writeに設定される。
    write ( chunk, encoding, callback ) {
        console.log( chunk.toString() );
        console.log( writable._writableState.getBuffer() );
        callback();
    }
});

writable.on( 'close', () => {
    console.log( 'close' );
    console.log( writable._writableState.getBuffer() );
} );

process.nextTick( () => {
    console.log( 'constructed in nextTick', writable._writableState.constructed );
    // constructed true
    // 先にnextTickキューに追加されていたconstructの初期化処理が完了している為、state.constructedの値がtrueになる。

    // state.constructedの値がtrueになっているので、ここの呼び出しはバッファされずに、this._writeが実行される。
    // その際、this._writeのcallbackの値として、state.onwriteが設定される。
    // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L392
    writable.write( 'chunk4' );

    // 既にこの時点で前段のwrite呼び出し3回分（chunk1、chunk2、chunk3）がバッファされているので、this._write内で呼び出されるcallback（state.onwrite）の中でclearBufferが実行される為、
    // 次のwritable.write( 'chunk5' );実行前に、先にバッファのデータからwrite処理が実行される（doWrite）
    // https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L464

    writable.write( 'chunk5' );
    writable.end();
} );

console.log( 'constructed', writable._writableState.constructed );
// constructed false

// https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L337
// 内部的に定義された_write（encodingやエラーのチェックをした後に、this._writeを実行するかchunkをbufferに追加するか判定＆実行する）
// constructの初期化がまだnextTickで実行されていない = state.constructedの値がfalseだから、下記のwrite呼び出しはstate.bufferedにバッファされる。
writable.write( 'chunk1' );
writable.write( 'chunk2' );
writable.write( 'chunk3' );

// https://github.com/nodejs/node/blob/v18.7.0/lib/internal/streams/writable.js#L209
console.log( 'getBuffer', writable._writableState.getBuffer() );
// この時点で、前段のwriteの引数で指定した文字列がBufferとしてwritable._writableState.bufferedに追加されている。
// ※ process.nextTick内のwriteはまだ呼び出されていない。
// getBuffer[
//     {
//         chunk: <Buffer 63 68 75 6e 6b 31>,
//         encoding: 'buffer',
//         callback: [ Function: nop ]
//     },
//     {
//         chunk: <Buffer 63 68 75 6e 6b 32>,
//         encoding: 'buffer',
//         callback: [ Function: nop ]
//     },
//     {
//         chunk: <Buffer 63 68 75 6e 6b 33>,
//         encoding: 'buffer',
//         callback: [ Function: nop ]
//     }
// ]
