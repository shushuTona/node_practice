const events = require( 'events' );

const eventAEmitter = new events.EventEmitter();

// events.onでasyncイテラブルを生成する
const eventAIterable = events.on( eventAEmitter, 'eventA' );
( async () => {
    // for await ...ofを抜ける時にリスナは解除される
    for await ( const a of eventAIterable ) {
        if ( a[ 0 ] == 'end' ) {
            break;
        }

        console.log( 'eventA', a );
    }
} )();

eventAEmitter.emit( 'eventA', 'Hello' );
eventAEmitter.emit( 'eventA', 'Hello', 'World' );
eventAEmitter.emit( 'eventA', 'end' );
