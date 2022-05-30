const { TransformStream } = require( './transformStream' );

const transformStream = new TransformStream();
transformStream
    .on( 'readable', () => {
        console.log( '===== readable =====' );

        let chunk;
        while ( ( chunk = transformStream.read() ) !== null ) {
            console.log( chunk );
        }
    } );

transformStream.write( 'Hello\n' );
transformStream.write( 'Hello World' );
transformStream.end();
