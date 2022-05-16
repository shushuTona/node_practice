const { WriteStream } = require( './writeStream' );

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
