const http = require( 'http' );
const express = require( 'express' );

const todos = [
    {
        id: 1,
        title: 'ネーム',
        completed: false,
    },
    {
        id: 2,
        title: '下書き',
        completed: true,
    },
];

const app = express();

app.get( '/api/todos', ( req, res ) => {
    return res.json( todos );
} );

app.listen( 8080 );

http.request( 'http://localhost:8080/api/todos', ( res ) => {
    let responseData;

    console.log( 'statusCode', res.statusCode );

    res.on( 'data', ( chunk ) => {
        responseData += chunk;
    } );

    res.on( 'end', () => {
        console.log( 'responseData', JSON.stringify( responseData ) );
    } );
} ).end();
