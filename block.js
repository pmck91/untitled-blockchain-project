const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static mineBlock({lastBlock, data}) {
        let hash, timestamp;
        const {difficulty} = lastBlock;
        const lastHash = lastBlock.hash;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            difficulty: difficulty,
            nonce: nonce,
            hash: hash,
            data: data
        });
    }

    static adjustDifficulty({originalBlock, timestamp}) {
        const {difficulty} = originalBlock;
        const difference = timestamp - originalBlock.timestamp;

        if (difference > MINE_RATE) {
            return difficulty - 1;
        } else {
            return difficulty + 1;
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

