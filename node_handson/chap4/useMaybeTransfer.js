'use strict';

const { Worker } = require( 'worker_threads' );
const { performance } = require( 'perf_hooks' );

// 転送の有無によるスレッド間送信のパフォーマンス比較
//
// 生成したBufferをサブスレッドに渡して、その時間を計測する
// transfer = true ：Bufferを転送する
// transfer = false：Bufferを転送しない（＝コピーする）
function useMaybeTransfer ( transfer ) {
    // 1GBのArrayBufferを作成する
    const buffer = new ArrayBuffer( 1024 * 1024 * 1024 );

    // 現在時刻取得
    const start = performance.now();

    const worker = new Worker(
        `${ __dirname }/maybe-transfer.js`,
        {
            workerData: { buffer, transfer },
            transferList: transfer ? [ buffer ] : []
        }
    )

    worker.on( 'message', () => {
        console.log( performance.now() - start );
    } );

    console.log( buffer );
}

useMaybeTransfer( true );
useMaybeTransfer( false );
