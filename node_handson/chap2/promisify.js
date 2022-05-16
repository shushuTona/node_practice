const util = require( 'util' );
const fs = require( 'fs' );

// 第一引数をエラーにしているNode.jsの規約に沿った非同期callback関数からPromiseを返す関数を生成する
const readdir = util.promisify( fs.readdir );
readdir( '.' ).then( console.log );

// fs.promises経由で実行する関数はPromiseを返す形式になっている
fs.promises.readdir( '.' ).then( console.log );

const setTimeoutPromise = util.promisify( setTimeout );
setTimeoutPromise( 1000 ).then( () => console.log( '1秒経過' ) );

Promise.all( [
    setTimeoutPromise( 1000 ),
    setTimeoutPromise( 2000 ),
    setTimeoutPromise( 3000 )
] ).then( () => console.log( 'Promise.all finished' ) );
