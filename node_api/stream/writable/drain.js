'use strict';

const stream = require( 'node:stream' );

const writable = new stream.Writable( {
    construct ( callback ) {
        console.log( '===== construct =====' );

        callback();
    },
    write ( chunk, encoding, callback ) {
        console.log( '===== write =====' );

        console.log( chunk.toString() );

        callback();
    },
    highWaterMark: 1
} );

writable.on( 'close', () => {
    console.log( 'close' );
    console.log( writable._writableState.getBuffer() );
} );

writable.on( 'drain', () => {
    console.log( 'drain' );
    console.log( writable._writableState.getBuffer() );
} );

writable.write( 'chunk 1' );

if (
    writable._writableState.needDrain
) {
    writable.once( 'drain', () => {
        writable.write( 'chunk 2', () => {
            writable.end();
        });
    } );
} else {
    writable.write( 'chunk 2' );
}
