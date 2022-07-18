'use strict';

const fs = require( 'fs' ).promises;

( async () => {
    // wasmファイルの読み込み
    const waBytes = await fs.readFile( './test.wasm' );

    // WebAssemblyをコンパイルする（WebAssembly.Moduleオブジェクトが生成される）
    const waModule = await WebAssembly.compile( waBytes );

    // インスタンス化する（WebAssembly.Instanceが生成される＆wasmファイルで定義してあるaddTwoにアクセス出来るようになる）
    const waInstance = await WebAssembly.instantiate( waModule );

    const result = waInstance.exports.addTwo( 1, 2 );

    console.log( result );
} )();
