'use strict';

const fibonacci = require( '../fibonacci' );
const { parentPort } = require( 'worker_threads' );

// メインスレッドからのメッセージの受信を待機する
parentPort.on( 'message', ( n ) => {
    console.log( n );

    // 計算結果をメインスレッドに送信する
    parentPort.postMessage( fibonacci( n ) );
} );
