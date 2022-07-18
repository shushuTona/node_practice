'use strict';

const fs = require( 'fs' ).promises;
const { WASI } = require( 'wasi' );

( async () => {
    const wasi = new WASI();
    const waBytes = await fs.readFile( './wasi.wasm' );

    const importObject = {
        wasi_unstable: wasi.wasiImport
    }
    const { instance } = await WebAssembly.instantiate( waBytes, importObject );

    wasi.start( instance );
} )();
