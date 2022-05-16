function* generatorFuncWithArg () {
    console.log( 'generator関数開始' );
    let count = 0;

    while ( true ) {
        // countを加算するタイミングで処理は停止する ＝ 処理結果評価後にif文の中に処理が進まない
        if ( yield count++ ) {
            console.log( 'if文の中' );
            count = 0;
        }
    }
}

const generator = generatorFuncWithArg();

console.log( generator.next() );
console.log( generator.next() );
console.log( generator.next() );
console.log( generator.next() );

// generatorFuncWithArg内で、直前に実行されたyieldの戻り値として取得できる
console.log( generator.next( true ) );

console.log( generator.next() );
