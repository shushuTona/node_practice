const { ReadStream } = require( './readStream' );
const { WriteStream } = require( './writeStream' );
const { TransformStream } = require( './transformStream' );

const readStream = new ReadStream();

// pipe : 引数に書き込みストリームを取る
// 引数に取ったストリームのインスタンスを返す
readStream
    .pipe( new TransformStream() )
    .pipe( new WriteStream() )
    .on( 'finish', () => console.log( '処理完了' ) );
