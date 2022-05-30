import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// 各ページに関する情報の定義
const pages = {
    index: { title: 'すべてのToDo' },
    active: { title: '未完了のToDo', completed: false },
    completed: { title: '完了したToDo', completed: true }
}

// CSRでページを切り替えるためのリンク
const pageLinks = Object.keys( pages ).map( ( page, index ) =>
    <Link href={`/${ page === 'index' ? '' : page }`} key={index}>
        <a style={{ marginRight: 10 }}>{pages[ page ].title}</a>
    </Link>
)

const Todos = ( props ) => {
    const { title, completed } = pages[ props.page ]
    const [ todos, setTodos ] = useState( [] );

    useEffect( () => {
        // EventSource
        const eventSource = new EventSource( '/api/todos/events' );

        // SSE受信時
        eventSource.addEventListener( 'message', ( event ) => {
            const todos = JSON.parse( event.data );

            console.log( todos );

            setTodos(
                typeof completed === 'undefined'
                    ? todos
                    : todos.filter( ( todo ) => {
                        return todo.completed === completed
                    } )
            );
        } );

        // SSEエラー時
        eventSource.addEventListener( 'error', ( err ) => console.log( err ) );

        // useEffectの戻り値に関数を指定することで副作用のクリーンアップをする
        return () => eventSource.close();
    }, [ props.page ] );

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <h1>{title}</h1>

            <ul>
                {todos.map( ( { id, title, completed } ) =>
                    <li key={id}>
                        <span style={completed ? { textDecoration: 'line-through' } : {}}>
                            {title}
                        </span>
                    </li>
                )}
            </ul>

            <div>{pageLinks}</div>
        </>
    )
}

export default Todos;
