'use strict';

const http = require( 'http' );
const cpuCount = require( 'os' ).cpus().length;
const ThreadPool = require( '../thread-pool' );

// 長さ1のint32Arrayインスタンスを作成
const sharedArrayBuffer = new SharedArrayBuffer( 4 );
const int32Array = new Int32Array( sharedArrayBuffer );

const threadPool = new ThreadPool(
    cpuCount,
    `${ __dirname }/fibonacci.js`,
    {
        workerData: int32Array
    }
);

// メインスレッド側のカウンタ
let count = 0;
http.createServer( async ( req, res ) => {
    if ( req.url === '/calls' ) {
        // /callsが呼び出された時は、メインスレッドのカウンタとサブスレッド側それぞれのリクエスト回数を表示
        console.log( `Main : ${ count }, Sub : ${ int32Array[ 0 ] }` );
    }
    const n = Number( req.url.substr( 1 ) );

    if ( Number.isNaN( n ) ) {
        return res.end();
    }

    count += 1;
    const result = await threadPool.executeInThread( n );
    res.end( result.toString() );
} ).listen( 8080 );
