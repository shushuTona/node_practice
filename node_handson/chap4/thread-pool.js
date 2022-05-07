'use strict';

const { Worker } = require( 'worker_threads' );

module.exports = class ThreadPool {
    // 空きスレッド、キューを初期化
    availableWorkers = [];
    queue = [];

    constructor( size, filePath, options ) {
        for ( let i = 0; i < size;  i++ ) {
            this.availableWorkers.push( new Worker( filePath, options ) );
        }
    }

    executeInThread ( arg ) {
        return new Promise( ( resolve ) => {
            const request = { resolve, arg };

            // 空きスレッドがあるか確認＆リクエストを処理 or キューに追加
            const worker = this.availableWorkers.pop();
            worker ? this.#process( worker, request ) : this.queue.push( request );
        } );
    }

    #process ( worker, { resolve, arg } ) {
        worker.once( 'message', ( result ) => {
            resolve( result );

            const request = this.queue.shift();
            request
                ? this.process( worker, request )
                : this.availableWorkers.push( worker );
        } );

        worker.postMessage( arg );
    }
}
