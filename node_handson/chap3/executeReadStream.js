const { ReadStream } = require( './readStream' );

const readStream = new ReadStream();
readStream
    .on( 'readable', () => {
        console.log( '===== readable =====' );

        let chunk;
        // this._readableState.bufferから4文字ずつBufferを取得してchunkに設定する
        while ( ( chunk = readStream.read( 4 ) ) !== null ) {
            console.log( chunk.toString() );
        }
    } )
    .on( 'end', () => console.log( '===== end =====' ) );