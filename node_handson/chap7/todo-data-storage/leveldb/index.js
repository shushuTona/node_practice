'use strict';

const level = require( 'level' );
const { join } = require( 'path' );

// dbインスタンス作成
const db = level( join( __dirname, 'leveldb' ) );

exports.fetchAll = async () => {
    const result = [];
    for await ( const value of db.createValueStream( { gt: 'todo:', lt: 'todo;' } ) ) {
        result.push( JSON.parse( value ) );
    }

    return result;
}

exports.fetchByCompleted = async ( completed ) => {
    const promises = [];
    for await ( const id of db.createValueStream( {
        gt: `todo-completed-${ completed }:`,
        lt: `todo-completed-${ completed }:`
    } ) ) {
        promises.push(
            db.get( `todo:${ id }` ).then( JSON.parse )
        );
    }

    return Promise.all( promises );
}

exports.create = ( todo ) => {
    return db.batch()
        .put( `todo:${ todo.id }`, JSON.stringify( todo ) )
        .put( `todo-completed-${ todo.completed }:${ todo.id }`, todo.id )
        .write();
}

exports.update = ( id, update ) => {
    return db.get( `todo:${ id }` )
            .then( ( content ) => {
                const oldTodo = JSON.parse( content );
                const newTodo = {
                    ...oldTodo,
                    ...update
                }

                let batch = db.batch().put( `todo:${ id }`, JSON.stringify( newTodo ) );
                if (
                    oldTodo.completed !== newTodo.completed
                ) {
                    batch = batch
                                    .del( `todo-completed-${ oldTodo.completed }:${ id }` )
                                    .put( `todo-completed-${ newTodo.completed }:${ id }`, id );
                }

                return batch.write();
            },
            ( err ) => {
                return err.notFound ? null : Promise.reject( err );
            }
    )
}

exports.remove = ( id ) => {
    return db.get( `todo:${ id }` )
        .then( ( content ) => {
            return db.batch()
                .del( `todo:${ id }` )
                .delete( `todo-completed-true:${ id }` )
                .delete( `todo-completed-false:${ id }` )
                .write()
                .then( () => id );
        },
            ( err ) => {
                return err.notFound ? null : Promise.reject( err );
            }
        )
}
