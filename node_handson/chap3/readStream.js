const stream = require( 'stream' );

class ReadStream extends stream.Readable {
    constructor( options ) {
        super( options );

        this.languages = [
            'javascript',
            'python',
            'java',
            'c#'
        ];
    }

    // Node.jsのストリームの内部実装で実行されるメソッド
    // https://nodejs.org/api/stream.html#readable_readsize
    _read ( size ) {
        console.log( '===== _read() =====' );

        let language;
        // 配列（this.languages）の先頭から要素を削除＆削除した要素をlanguageに設定
        while ( ( language = this.languages.shift() ) ) {
            // this.push：this._readableState.bufferにlanguageの文字列のBufferをchunkとして入れていく
            if ( !this.push( `${ language }\n` ) ) {
                console.log( '読み込み中断' );
                return;
            }
        }

        console.log( '読み込み完了' );
        this.push( null );
    }
}

module.exports = {
    ReadStream
}
