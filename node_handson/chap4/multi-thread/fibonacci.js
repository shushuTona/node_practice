'use strict';

const fibonacci = require( '../fibonacci' );
const { workerData, parentPort } = require( 'worker_threads' );

// 計算結果をメインスレッドに送信する
parentPort.postMessage( fibonacci( workerData ) );
