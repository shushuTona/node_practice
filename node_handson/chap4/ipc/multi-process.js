'use strict';

const { fork, setupMaster } = require( 'cluster' );

console.log( 'main process', process.pid );

// サブプロセスが実行するファイルを指定
setupMaster( {
    exec: `${ __dirname }/web-app`
} );

// CPUコアの数だけプロセスをフォークする
const cpuCount = require( 'os' ).cpus().length;
for ( let i = 0; i < cpuCount; i++ ) {
    const sub = fork();
    console.log( 'sub process', sub.process.pid );

    // IPCでサブプロセスにポート番号を送信
    sub.send( 8080 );

    sub.on( 'message', ( { pid, responce } ) => {
        console.log( process.pid, `${ pid }が${ responce }を返します` );
    } );
}
