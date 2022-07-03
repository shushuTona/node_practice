'use strict';

const fileSystem = require( '../file-system' );
const uuid = require( 'uuid' );
const request = require( 'supertest' );

process.env.npm_lifecycle_event = 'file-system';
const app = require( '../app' );

jest.mock( '../file-system' );
jest.mock( 'uuid' );

afterAll( () => {
    return app.close();
} );

describe( 'app', () => {
    describe( 'GET /api/todos', () => {
        describe( 'completedが指定されていない場合', () => {
            it( 'fetchAllで取得したToDoの配列を返す', async () => {
                const todos = [
                    { id: 'a', title: 'ネーム', completed: false },
                    { id: 'b', title: '下書き', completed: true }
                ];

                // モックが返す値を設定する
                fileSystem.fetchAll.mockResolvedValue( todos );

                const res = await request( app ).get( '/api/todos' );

                expect( res.statusCode ).toBe( 200 );
                expect( res.body ).toEqual( todos );
            } );

            it( 'fetchAllが失敗したらエラーを返す', async () => {
                // モックが返す値を設定する
                fileSystem.fetchAll.mockRejectedValue( new Error( 'fetchAll失敗' ) );

                const res = await request( app ).get( '/api/todos' );

                expect( res.statusCode ).toBe( 500 );
                expect( res.body ).toEqual( { error: 'fetchAll失敗' } );
            } );
        } );

        describe( 'completedが指定されている場合', () => {
            it( 'completedを引数にfetchByCompletedを実行し取得したToDoの配列を返す', async () => {
                const todos = [
                    { id: 'a', title: 'ネーム', completed: false },
                    { id: 'b', title: '下書き', completed: true }
                ];

                fileSystem.fetchByCompleted.mockResolvedValue( todos );

                for ( const completed of [ true, false ] ) {
                    const res = await request( app )
                                                .get( '/api/todos' )
                                                .query( { completed } );

                    expect( res.statusCode ).toBe( 200 );
                    expect( res.body ).toEqual( todos );
                    expect( fileSystem.fetchByCompleted ).toHaveBeenCalledWith( completed );
                }
            } );

            it( 'fetchByCompletedが失敗したらエラーを返す', async () => {
                fileSystem.fetchByCompleted.mockRejectedValue( new Error( 'fetchByCompleted失敗' ) );

                const res = await request( app )
                                                .get( '/api/todos' )
                                                .query( { completed: true } );

                expect( res.statusCode ).toBe( 500 );
                expect( res.body ).toEqual( { error: 'fetchByCompleted失敗' } );
            } );
        } );
    } );

    describe( 'POST /api/todos', () => {
        it( 'パラメータで指定したtitleを引数にcreateを実行して、結果を返す', async () => {
            uuid.v4.mockReturnValue( 'a' );
            fileSystem.create.mockResolvedValue();

            const res = await request( app )
                                                .post( '/api/todos' )
                                                .send( { title: 'ネーム' } );

            const expectedToDo = { id: 'a', title: 'ネーム', completed: false };
            expect( res.statusCode ).toBe( 201 );
            expect( res.body ).toEqual( expectedToDo );
            expect( fileSystem.create ).toHaveBeenCalledWith( expectedToDo );
        } );

        it( 'パラメータにタイトルが指定されていない場合400エラーを返す', async () => {
            uuid.v4.mockReturnValue( 'a' );
            fileSystem.create.mockResolvedValue();

            for ( const title of [ '', undefined ] ) {
                const res = await request( app )
                                                    .post( '/api/todos' )
                                                    .send( { title } );

                expect( res.statusCode ).toBe( 400 );
                expect( res.body ).toEqual( { error: 'title is required' } );
                expect( fileSystem.create ).not.toHaveBeenCalled();
            }
        } );

        it( 'createが失敗したらエラーを返す', async () => {
            fileSystem.create.mockRejectedValue( new Error( 'create失敗' ) );

            const res = await request( app )
                                                .post( '/api/todos' )
                                                .send( { title: 'ネーム' } );

            expect( res.statusCode ).toBe( 500 );
            expect( res.body ).toEqual( { error: 'create失敗' } );
        } );
    } );
} );
