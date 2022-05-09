const http = require( 'http' );

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

const server = http.createServer( ( req, res ) => {
    if (
        req.url === '/api/todos'
    ) {
        if (
            req.method === 'GET'
        ) {
            res.setHeader( 'Content-Type', 'application/json' );
            return res.end( JSON.stringify( todos ) );
        }

        res.statusCode = 405;
    } else {
        res.statusCode = 404;
    }

    res.end();
} );

server.listen( 8080 );

// 5秒後にサーバーを停止する
setTimeout( () => {
    console.log( 'サーバー停止' );
    server.close();
}, 5000 );

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

// POSTだからステータスコードが405になる
http.request(
    'http://localhost:8080/api/todos',
    {
        method: 'POST'
    },
    ( res ) => {
    console.log( 'statusCode', res.statusCode );
} ).end();

// URLが期待したものでないとステータスコードが404になる
http.request(
    'http://localhost:8080/api/test',
    ( res ) => {
    console.log( 'statusCode', res.statusCode );
} ).end();
