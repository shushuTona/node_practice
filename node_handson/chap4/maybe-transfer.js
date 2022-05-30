'use strict';

// 転送：オブジェクトのコピーではなく対象スレッドにオブジェクトを渡すこと
// → オブジェクトの所有権も対象スレッドに移る為、元スレッドからはそのオブジェクトを利用できなくなる

// 転送可能オブジェクト
// ・ArrayBuffer
// ・MessagePort
// ・FileHandle

const { parentPort, workerData } = require( 'worker_threads' );

parentPort.postMessage(
    workerData.buffer,
    workerData.transfer ? [ workerData.buffer ] : []
)
