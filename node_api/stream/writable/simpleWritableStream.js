'use strict';

const stream = require( 'node:stream' );

const writable = new stream.Writable( {
    write ( chunk, encoding, callback ) {
        console.log( chunk.toString() );
        console.log( writable._writableState.getBuffer() );
        callback();
    }
} );

writable.on( 'close', () => {
    console.log( 'close' );
    console.log( writable._writableState.getBuffer() );
} );

writable.write( 'chunk1' );
writable.write( 'chunk2' );
writable.write( 'chunk3' );
writable.write( 'chunk4' );
writable.write( 'chunk5' );
writable.end();
