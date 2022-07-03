'use strict';

const { extname } = require( 'path' );
const { readdir, readFile, writeFile, unlink } = require( 'fs' ).promises;

exports.fetchAll = async () => {
    const files = ( await readdir( __dirname ) )
                            .filter( ( file ) => {
                                return extname( file ) === '.json';
                            } );

    console.log( 'files', files );

    return Promise.all(
        files.map( ( file ) => {
            return readFile( `${ __dirname }/${ file }`, 'utf8' )
                .then( JSON.parse );
        } )
    );
}

exports.fetchByCompleted = ( completed ) => {
    return exports.fetchAll()
        .then( ( all ) => {
            all.filter( ( todo ) => {
                return todo.completed === completed;
            } )
        } );
}

exports.create = ( todo ) => {
    return writeFile( `${ __dirname }/${ todo.id }.json`, JSON.stringify( todo ) );
}

exports.update = async (id, update) => {
    const fileName = `${ __dirname }/${ id }.json`;
    return readFile( fileName, 'utf8' )
        .then( ( content ) => {
            const todo = {
                ...JSON.parse( content ),
                ...update
            }
            return writeFile( fileName, JSON.stringify( todo ) ).then( () => todo );
        },
            ( err ) => {
                return err.code === 'ENOENT' ? null : Promise.reject( err );
            }
    );
}

exports.remove = ( id ) => {
    return unlink( `${ __dirname }/${ id }.json` )
        .then(
            () => id,
            ( err ) => {
                return err.code === 'ENOENT' ? null : Promise.reject( err );
            }
        );
}
