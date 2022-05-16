function parseJSONSync ( json ) {
    try {
        return JSON.parse( json )
    } catch ( err ) {
        console.log('エラーキャッチ', err );
    }
}

parseJSONSync( '不正なJSON' );
// エラーキャッチ SyntaxError: Unexpected token 不 in JSON at position 0
//     at JSON.parse( <anonymous>)
//         at parseJSONSync (/node_handson/chap2/callbackErrorHandling.js:3:21)
//         at Object.<anonymous> (/node_handson/chap2/callbackErrorHandling.js:9:1)

function parseJSONAsync_before ( json, callback ) {
    try {
        setTimeout( () => {
            callback( JSON.parse( json ) )
        }, 1000 );
    } catch ( err ) {
        console.log( 'エラーキャッチ', err );
        callback( {} );
    }
}
parseJSONAsync_before( '不正なJSON', ( result ) => {
    console.log('parse結果', result );
} );
// SyntaxError: Unexpected token 不 in JSON at position 0
//     at JSON.parse( <anonymous>)
//     at Timeout._onTimeout (/node_handson/chap2/callbackErrorHandling.js:15:28)    at listOnTimeout (internal/timers.js:557:17)
//     at processTimers (internal/timers.js:500:7)
//
// ・ ”エラーキャッチ”の文言が無い ＝ catchでエラーキャッチ出来てない
// ・ JSON.parseがどこの関数で呼び出されたのかのスタックトレースが表示されない
// → setTimeoutのコールバック関数は、parseJSONAsync_beforeの同期処理が完了した後、イベントループから実行される為、呼び出し元がparseJSONAsync_beforeにならない
//
// try / catchがsetTimeoutの外にあると、setTimeoutのコールバック関数がイベントループまで届いた後にJSON.parseのエラーが発生する

function parseJSONAsync ( json, callback ) {
    setTimeout(() => {
        try {
            callback( null, JSON.parse( json ) );
        } catch ( err ) {
            callback( err );
        }
    }, 1000);
}
parseJSONAsync( '不正なJSON', ( err, result ) => {
    console.log( 'parse結果', err, result );
} );
// parse結果 SyntaxError: Unexpected token 不 in JSON at position 0
//     at JSON.parse( <anonymous>)
//     at Timeout._onTimeout (/node_handson/chap2/callbackErrorHandling.js:42:34)
//     at listOnTimeout (internal/timers.js:557:17)
//     at processTimers (internal/timers.js:500:7) undefined
//
// ・ callbackの引数にエラーを持たせることで、エラー内容を実行元に返すことができる
// ＝ これがNode.jsの規約として、コールバック関数の第一引数にエラーを渡すことの理由
// ・ 関数の引数にコールバック関数を使う場合、一番最後の引数にする。のもNode.jsの規約らしい
