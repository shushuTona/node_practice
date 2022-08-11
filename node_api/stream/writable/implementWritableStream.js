'use strict';

const stream = require( 'stream' );

class myWritable extends stream.Writable {
    constructor( options ) {
        super( options );
        this.data = '';
    }

    _write ( chunk, encoding, callback ) {
        this.data += ( this.data.length === 0 ? '' : '/') + chunk.toString();
        callback();
    }
}

const writable = new myWritable();

writable.on( 'close', () => {
    console.log( writable.data );
} );

writable.write( 'A' );
writable.write( 'B' );
writable.write( 'C' );
writable.end();
