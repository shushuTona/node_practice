'use strict';

const sortTodoById = ( todos ) => {
    return todos.sort( ( a, b ) => {
        return a.id > b.id ? 1 : -1;
    } );
}

const dataStorageNameList = [ 'file-system', 'sqlite', 'leveldb' ];

for ( const dataStorageName of dataStorageNameList ) {
    const { fetchAll, fetchByCompleted, create, update, remove } = require( `../${ dataStorageName }` );

    describe( dataStorageName, () => {
        beforeEach( async () => {
            const allTodos = await fetchAll();
            await Promise.all( allTodos.map( ( { id } ) => remove( id ) ) );
        } );

        describe( 'fetchAll, create', () => {
            it( 'create()で作成したToDoをfetchAll()で取得する', async () => {
                expect( await fetchAll() ).toEqual( [] );

                const todo1 = {
                    id: 'a',
                    title: 'todo1',
                    completed: false
                }
                await create( todo1 );
                expect( await fetchAll() ).toEqual( [ todo1 ] );

                const todo2 = {
                    id: 'b',
                    title: 'todo2',
                    completed: true
                }
                await create( todo2 );

                const todo3 = {
                    id: 'c',
                    title: 'todo3',
                    completed: false
                }
                await create( todo3 );

                expect( sortTodoById(await fetchAll()) ).toEqual( [ todo1, todo2, todo3 ] );
            } );
        } );

        describe( 'fetchByCompleted', () => {
            it( 'completedの値が指定した値のToDoだけ取得する', async () => {
                expect( await fetchByCompleted( true ) ).toEqual( [] );
                expect( await fetchByCompleted( false ) ).toEqual( [] );

                const todo1 = {
                    id: 'a',
                    title: 'todo1',
                    completed: false
                }
                await create( todo1 );

                const todo2 = {
                    id: 'b',
                    title: 'todo2',
                    completed: true
                }
                await create( todo2 );

                const todo3 = {
                    id: 'c',
                    title: 'todo3',
                    completed: false
                }
                await create( todo3 );

                expect( await fetchByCompleted( true ) ).toEqual( [ todo2 ] );
                expect( sortTodoById( await fetchByCompleted( false ) ) ).toEqual( [ todo1, todo3 ] );
            } );
        } );

        describe( 'update', () => {
            const todo1 = {
                id: 'a',
                title: 'todo1',
                completed: false
            }
            const todo2 = {
                id: 'b',
                title: 'todo2',
                completed: false
            }

            beforeEach( async () => {
                await create( todo1 );
                await create( todo2 );
            } );

            it( '指定したIDのToDoを更新して、更新したToDoを返す', async () => {
                expect( await update( 'a', { completed: true } ) ).toEqual( {
                    id: 'a',
                    title: 'todo1',
                    completed: true
                } );

                expect( await fetchByCompleted( true ) ).toEqual( [ {
                    id: 'a',
                    title: 'todo1',
                    completed: true
                } ] );

                expect( await fetchByCompleted( false ) ).toEqual( [ todo2 ] );

                expect( await update( 'b', { title: 'updated todo2' } ) ).toEqual( {
                    id: 'b',
                    title: 'updated todo2',
                    completed: false
                } );

                expect( await fetchByCompleted( false ) ).toEqual( [ {
                    id: 'b',
                    title: 'updated todo2',
                    completed: false
                } ] );
            } );

            it( '存在しないtodoを更新しようとするとnullを返す', async () => {
                expect( await update( 'c', { completed: true } ) ).toBeNull();
                expect( await fetchByCompleted( true ) ).toEqual( [] );
                expect( sortTodoById( await fetchByCompleted( false ) ) ).toEqual( [ todo1, todo2 ] );
            } );
        } );

        describe( 'remove', () => {
            const todo1 = {
                id: 'a',
                title: 'todo1',
                completed: false
            }
            const todo2 = {
                id: 'b',
                title: 'todo2',
                completed: false
            }

            beforeEach( async () => {
                await create( todo1 );
                await create( todo2 );
            } );

            it( '指定されたIDのToDoを削除する', async () => {
                expect( await remove( 'b' ) ).toBe( 'b' );
                expect( await fetchAll() ).toEqual( [ todo1 ] );
            } );

            it( '存在しないIDのToDoを削除しようとするとnullを返す', async () => {
                expect( await remove( 'c' ) ).toBeNull();
                expect( sortTodoById( await fetchByCompleted( false ) ) ).toEqual( [ todo1, todo2 ] );
            } );
        } );
    } );
}
