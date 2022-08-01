'use strict';

const stream = require( 'stream' );

class myWritable extends stream.Writable {
    constructor( options ) {
        super( options );
        this.data = '';
    }

    _write ( chunk, encoding, callback ) {
        this.data += chunk.toString() + "\n";
        callback();
    }
}

const writable = new myWritable();

writable.on( 'close', () => {
    console.log( writable.data );
} );

writable.write( 'chunk 1' );
writable.write( 'chunk 2' );
writable.write( 'chunk 3' );
writable.end();
