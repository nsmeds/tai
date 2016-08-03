const assert = require('chai').assert;
const exec = require('child_process').execSync;

const tai = '../bin/tai';

describe('tai', () => {

    it( 'configs', done => {
        exec( tai, 'config students.json' )
    })
});