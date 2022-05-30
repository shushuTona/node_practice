const { ReadStream } = require( './readStream' );

const readStream = new ReadStream();

// 読み込みストリームは、[Symbol.asyncIterator]()メソッドを持ったasyncイテラブル
readStream
    .on( 'end', () => console.log( 'end' ) );

( async () => {
    for await ( const data of readStream ) {
        console.log( 'data', data.toString() );
    }
} )();
