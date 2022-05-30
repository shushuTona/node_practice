'use strict'
const express = require( 'express' );

const todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true }
];

const next = require('next');
const dev = true;
const port = 8080;
const nextApp = next( { dev, port } );
const handle = nextApp.getRequestHandler();

let sseSenders = [];
let sseId = 1;

const onUpdateTodos = () => {
    sseId += 1;
    const data = JSON.stringify( todos );
    sseSenders.forEach( ( send ) => {
        send( sseId, data );
    } );
}

// IDの値を管理するための変数
let id = 2;

nextApp.prepare().then(
    () => {
        const app = express();

        app.use( express.json() );

        // ToDo一覧の取得
        app.get( '/api/todos', ( req, res ) => {
            if ( !req.query.completed ) {
                return res.json( todos );
            }

            const completed = req.query.completed === 'true';
            res.json( todos.filter( todo => todo.completed === completed ) );
        } );

        app.get( '/api/todos/events', ( req, res ) => {
            // タイムアウト抑止
            req.socket.setTimeout( 0 );

            res.set( {
                // SSEのレスポンスタイプ指定
                'Content-Type': 'text/event-stream'
            } );

            const send = ( id, data ) => {
                res.write( `id: ${ id }\ndata: ${ data }\n\n` );
            }

            sseSenders.push( send );

            send( sseId, JSON.stringify( todos ) );

            req.on( 'close', () => {
                res.end();

                sseSenders = sseSenders.filter( ( _send ) => {
                    return _send !== send;
                } );
            } );
        } );

        // ToDoの新規登録
        app.post( '/api/todos', ( req, res, next ) => {
            const { title } = req.body
            if (
                typeof title !== 'string' ||
                !title
            ) {
                // titleがリクエストに含まれない場合はステータスコード400（Bad Request）
                const err = new Error( 'title is required' );
                err.statusCode = 400;

                return next( err );
            }

            const todo = { id: id += 1, title, completed: false };

            todos.push( todo );

            onUpdateTodos();
        } );

        // 指定されたIDのToDoを取得するためのミドルウェア
        app.use( '/api/todos/:id(\\d+)', ( req, res, next ) => {
            const targetId = Number( req.params.id );
            const todo = todos.find( todo => todo.id === targetId );

            if (
                !todo
            ) {
                const err = new Error( 'ToDo not found' );
                err.statusCode = 404;

                return next( err );
            }

            req.todo = todo;

            next();
        } );

        // ToDoのCompletedの設定、解除
        app.route( '/api/todos/:id(\\d+)/completed' )
            .put( ( req, res ) => {
                req.todo.completed = true;
                res.json( req.todo );
            } )
            .delete( ( req, res ) => {
                req.todo.completed = false;
                res.json( req.todo );
            } );

        // ToDoの削除
        app.delete( '/api/todos/:id(\\d+)', ( req, res ) => {
            todos = todos.filter( todo => todo !== req.todo );
            res.status( 204 ).end();
        } );

        // エラーハンドリングミドルウェア
        app.use( ( err, req, res, next ) => {
            console.error( err );
            res.status( err.statusCode || 500 ).json( { error: err.message } );
        } );

        // pagesディレクトリ内の各Reactコンポーネントに対するサーバサイドルーティング
        app.get( '*', ( req, res ) => {
            return handle( req, res );
        } );

        app.listen( port );
    },
    err => {
        console.error( err );
        process.exit( 1 );
    }
);
