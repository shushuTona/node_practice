'use strict';

const fibonacci = require( '../fibonacci' );
const { workerData: int32Array, parentPort } = require( 'worker_threads' );

parentPort.on( 'message', ( n ) => {
    console.log( n );

    // 計算結果をメインスレッドに送信する
    parentPort.postMessage( fibonacci( n ) );

    // 値の取得＆更新という処理が含まれている為、スレッドセーフな処理になっていない
    // int32Array[ 0 ] += 1;
    // ↓
    // Atomics：SharedArrayBufferをスレッドセーフに扱う為のグローバルオブジェクト
    Atomics.add( int32Array, 0, 1 );
    // int32Array の 0番目 に 1 を加算する
} );
