function parseJSONAsync ( json ) {
    return new Promise( ( resolve, reject ) => {
        setTimeout( () => {
            try {
                resolve( JSON.parse( json ) );
            } catch ( err ) {
                reject( err );
            }
        }, 1000 );
    })
}

function* asyncWithGeneratorFunc ( json ) {
    try {
        const result = yield parseJSONAsync( json );
        console.log( 'parse result : ', result );
    } catch ( err ) {
        console.log( 'catch error : ', err );
    }
}

const generator1 = asyncWithGeneratorFunc( '{ "test": 100 }' );
console.log( generator1 );

const promise1 = generator1.next().value;
console.log( promise1 );

promise1.then( ( result ) => {
    console.log( result );
    generator1.next( result );
});

const generator2 = asyncWithGeneratorFunc( '不正なJSON' );
console.log( generator2 );

const promise2 = generator2.next().value;
console.log( promise2 );

promise2.catch( ( err ) => {
    console.log( err );
    generator2.throw( err )
});
