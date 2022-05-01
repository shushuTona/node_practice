const events = require( 'events' );

const eventEmitter = new events.EventEmitter();

const eventPromise = events.once( eventEmitter, 'eventA' );
eventPromise.then( ( arg ) => {
    console.log( 'eventA : ', arg );
} );

eventEmitter.emit( 'eventA', 'Hello', 'World' );
