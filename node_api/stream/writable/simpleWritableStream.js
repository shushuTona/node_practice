'use strict';

const stream = require( 'node:stream' );

const writable = new stream.Writable( {
    highWaterMark: 1,
    construct ( callback ) {
        this.data = [];
        callback();
    },
    write ( chunk, encoding, callback ) {
        console.log( chunk.toString() );
        this.data.push( chunk.toString() );
        callback();
    }
} );

writable.on( 'close', () => {
    console.log( 'close' );
    console.log( writable.data );
} );

writable.write( 'chunk1');
writable.write( 'chunk2' );
writable.write( 'chunk3' );
writable.write( 'chunk4' );
writable.write( 'chunk5' );
writable.end();
