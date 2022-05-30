function* generatorFunc () {
    console.log( 'generator関数開始' );

    console.log('1つ目の戻り値');
    yield 1;

    console.log('2つ目の戻り値');
    yield 2;

    console.log('3つ目の戻り値');
    yield 3;

    return 'generator関数の戻り値';
}

const generator = generatorFunc();
console.log( generator.next() );
console.log( generator.next() );
console.log( generator.next() );
console.log( generator.next() );
console.log( generator.next() );

// ジェネレータはイテレータでもある
const generator2 = generatorFunc();
const iterator = generator2[ Symbol.iterator ]();
console.log( iterator.next() );
console.log( iterator.next() );
console.log( iterator.next() );
console.log( iterator.next() );
console.log( iterator.next() );

// 配列やMap、Setからもイテレータが生成できる
const iteratorFromArray = [ 1, 2, 3 ][ Symbol.iterator ]();
console.log( iteratorFromArray.next() );
console.log( iteratorFromArray.next() );
console.log( iteratorFromArray.next() );
console.log( iteratorFromArray.next() );
