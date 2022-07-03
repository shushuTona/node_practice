'use strict';

const { promisify } = require( 'util' );
const { join } = require( 'path' );
const sqlite3 = process.env.NODE_ENV === 'production' ? require( 'sqlite3' ) : require( 'sqlite3' ).verbose();

// DBインスタンスを作成
const db = new sqlite3.Database( join( __dirname, 'sqlite' ) );

// 各DB操作をpromise化する
const dbGet = promisify( db.get.bind( db ) );
const dbRun = function() {
    return new Promise( ( resolve, reject ) => {
        db.run.apply( db, [
            ...arguments,
            function( err ) {
                err ? reject( err ) : resolve( this );
            }
        ] )
    } );
};
const dbAll = promisify( db.all.bind( db ) );

// todo tableが存在しない場合table作成
dbRun( `create table if not exists todo(
    id text primary key,
    title text not null,
    completed boolean not null
)`)
    .catch( ( err ) => {
        console.error( err );
        process.exit( 1 );
    } );

const rowToTodo = ( row ) => {
    return {
        ...row,
        completed: !!row.completed
    }
}

exports.fetchAll = () => {
    return dbAll( 'select * from todo' )
        .then( ( rows ) => {
            return rows.map( rowToTodo );
        } );
}

exports.fetchByCompleted = ( completed ) => {
    return dbAll( 'select * from todo where completed = ?', completed )
        .then( ( rows ) => {
            return rows.map( rowToTodo );
        })
}

exports.create = async ( todo ) => {
    await dbRun(
        'insert into todo values (?, ?, ?)',
        todo.id,
        todo.title,
        todo.completed
    )
}

exports.update = ( id, update ) => {
    const setColumns = [];
    const values = [];
    for ( const column of [ 'title', 'completed' ] ) {
        if (
            column in update
        ) {
            setColumns.push( `${ column } = ?` );
            values.push( update[ column ] );
        }
    }

    values.push( id );

    return dbRun( `update todo set ${ setColumns.join() } where id = ?`, values )
        .then( ( { changes } ) => {
            return changes === 1 ? dbGet( 'select * from todo where id = ?', id ).then( rowToTodo ) : null;
        })
}

exports.remove = ( id ) => {
    return dbRun( 'delete from todo where id = ?', id )
        .then( ( { changes } ) => {
            return changes === 1 ? id : null;
        } );
}
