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
function parseJSONAsyncWithCache_before ( json, callback ) {
    const cached = cache[ json ];

    if ( cached ) {
        callback( cached.err, cached.result );
        return;
    }

    parseJSONAsync( json, ( err, result ) => {
        cache[ json ] = { err, result };
        callback( err, result );
    } );
}
parseJSONAsyncWithCache_before(
    '{ "message": "Hello", "to": "World" }',
    ( err, result ) => {
        console.log( '1回目の結果', err, result );

        parseJSONAsyncWithCache_before(
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
// 2回目の結果 null { message: 'Hello', to: 'World' }
// 2回目の呼び出し完了
//
// 1回目の呼び出しのcallbackは非同期処理で実行されるが、2回目のcallbackは同期処理で実行される
// → 呼び出しの状況によって、同期処理と非同期処理が混在するアンチパターン

const cache2 = {};
function parseJSONAsyncWithCache ( json, callback ) {
    const cached = cache2[ json ];

    if ( cached ) {
        // キャッシュが存在しても、非同期処理での実行にする（イベントループがcallbackを実行するようにする）
        setTimeout(() => {
            callback( cached.err, cached.result );
        }, 0);
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
// キャッシュが存在する場合のcallback実行もsetTimeout内で実行することで、処理の整合性を担保する