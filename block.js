const hextoBinary = require('hex-to-binary');
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor( {timestamp, lastHash, hash, data, nonce, difficulty} ) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static mineBlock( {lastBlock, data} ) {
        let hash, timestamp;
        let {difficulty} = lastBlock;
        const lastHash = lastBlock.hash;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp});
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        }
        while ( hextoBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty) );

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            difficulty: difficulty,
            nonce: nonce,
            hash: hash,
            data: data
        });
    }

    static adjustDifficulty( {originalBlock, timestamp} ) {
        let {difficulty} = originalBlock;

        const difference = timestamp - originalBlock.timestamp;

        if ( difference > MINE_RATE ) {
            difficulty--;
        } else {
            difficulty++;
        }

        if ( difficulty < 1 ) {
            return 1;
        } else {
            return difficulty
        }
    }

    //genesis factory method
    static genesis() {
        return new this(
            GENESIS_DATA
        );
    }

}

module.exports = Block;

