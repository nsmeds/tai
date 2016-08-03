const assert = require('chai').assert;
const exec = require('child_process').execSync;
const read = require('fs').readFileSync;

const tai = '../tai';

describe('tai', () => {

    it('config', done => {
        exec(tai, 'team students.json');
        const branches = exec(tai, 'team');
        const expected = read('./students.json');
        assert.equal(branches, expected);
    })
});