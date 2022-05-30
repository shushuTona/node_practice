function parseJSONAsync ( json, callback ) {
    setTimeout( () => {
        try {
            callback( null, JSON.parse( json ) );
        } catch ( err ) {
            callback( err );
        }
    }, 1000 );
}

const cache = {};
function parseJSONAsyncWithCache ( json, callback ) {
    const cached = cache[ json ];

    if ( cached ) {
        process.nextTick( () => callback( cached.err, cached.result ) );
        // queueMicrotask( () => callback( cached.err, cached.result ) );
        // Promise.resolve().then( () => callback( cached.err, cached.result ) );
        return;
    }

    parseJSONAsync( json, ( err, result ) => {
        cache[ json ] = { err, result };
        callback( err, result );
    } );
}
parseJSONAsyncWithCache(
    '{ "message": "Hello", "to": "World" }',
    ( err, result ) => {
        console.log( '1回目の結果', err, result );

        parseJSONAsyncWithCache(
            '{ "message": "Hello", "to": "World" }',
            ( err, result ) => {
                console.log( '2回目の結果', err, result );
            }
        )
        console.log( '2回目の呼び出し完了' );
    }
)
console.log( '1回目の呼び出し完了' );
// 1回目の呼び出し完了
// 1回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の呼び出し完了
// 2回目の結果 null { message: 'Hello', to: 'World' }
//
// イベントループは下記の6つのフェーズを持っている
// ・timers
// 　・ setTimeout, setIntervalによってスケジュールされたコールバック実行
// ・pending callbacks
// 　・ ・pending_queueというキューに入れられたコールバックの実行
// ・idle, prepare
// 　・ Node.jsが内部的に使用するフェーズ
// ・poll
// 　・ 他のフェーズで処理する以外のI/O関連のコールバック実行
// 　・ 他のフェーズで処理する必要のあるコールバックがない場合、ここのフェーズで待機する
// ・check
// 　・ setImmmediateによってスケジュールされたコールバック実行
// ・close callbacks
// 　・ closeイベントのコールバック実行

// process.nextTickで指定したcallback関数は上記のフェーズではなく、nextTickQueueというキューに追加される
// nextTickQueueに追加されたcallbackは、イベントループがその時点で対応しているフェーズの処理が完了後、次のフェーズ処理に移る前に実行される
// ※ process.nextTickはNode.jsのAPIなので、Webブラウザで実行するコードでは使用できない

// Web環境で実行するコードでは、queueMicrotaskというグローバルメソッドを実行する
// queueMicrotaskで指定したcallbackは、V8が管理するmicroTaskQueueに追加され、イベントループが次のフェーズに移る前に実行される

// Promiseで指定したcallbackもqueueMicrotask同様に、microTaskQueueに追加される

// ※ nextTickQueueやmicroTaskQueueには、1度に実行できる回数制限が存在しない為、process.nextTickを再帰的に実行し続けたりすると
// イベントループが次のフェーズに移動出来なくなる
