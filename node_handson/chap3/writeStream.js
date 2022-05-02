const stream = require( 'stream' );

class WriteStream extends stream.Writable {
    constructor( options ) {
        super( {
            // objectMode: trueに設定すると、オブジェクトをデータとして流すことができる
            objectMode: true,
            ...options
        } );
    }

    _write ( chunk, encoding, callback ) {
        console.log( '===== _write() =====' );

        const { message, delay } = chunk;

        setTimeout(() => {
            console.log( message );
            callback();
        }, delay );
    }
}

const writeStream = new WriteStream();

writeStream.write( {
    message: 'Hello',
    delay: 0,
} );

writeStream.write( {
    message: 'Hello World',
    delay: 1000,
} );

writeStream.end( {
    message: 'end...',
    delay: 1000,
} );
