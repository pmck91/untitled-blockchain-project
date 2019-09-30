const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    // foo -> 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae
    // foo -> 1011000010011010110100011010110110100011111111110001101000111111
    //        1110011001101101000101001111000001110100110000010000010011010000
    //        0100110100001000101101011100000110010010000011101111111010000011
    //        11100110001010010111101000100001100010011001101110011110101110

    it('generates a SHA-256 hash output', () => {
        expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
    });
});