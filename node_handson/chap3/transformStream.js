const stream = require( 'stream' );

class TransformStream extends stream.Transform {
    remainting = '';

    constructor( options ) {
        super( {
            readableObjectMode: true,
            ...options
        } );
    }

    _transform ( chunk, encoding, callback ) {
        console.log( '===== _transform =====' );

        const lines = ( chunk + this.remainting ).split( /\n/ );
        this.remainting = lines.pop();
        for (const line of lines) {
            this.push( {
                message: line,
                delay: line.length * 100
            } );
        }

        callback();
    }

    _flush ( callback ) {
        console.log( '===== _flush =====' );

        this.push( {
            message: this.remainting,
            delay: this.remainting.length * 100
        } );

        callback();
    }
}

module.exports = {
    TransformStream
}
