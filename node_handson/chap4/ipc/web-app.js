'use strict';

const http = require( 'http' );
const fibonacci = require( '../fibonacci' );
const pid = process.pid;

process.on( 'message', ( port ) => {
    console.log( pid, `ポート${ port }でWebサーバー起動` );

    http.createServer( ( req, res ) => {
        const n = Number( req.url.substr( 1 ) );

        if ( Number.isNaN( n ) ) {
            return res.end();
        }

        const responce = fibonacci( n );

        // 結果をIPCで送信
        process.send( { pid, responce } );
        res.end( responce.toString() );
    } ).listen( port );
} );
