const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({timestamp, lastHash, hash, data}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static mineBlock({ lastBlock, data}){
        const timestamp = Date.now();

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            hash: cryptoHash(timestamp, lastBlock.hash, data),
            data: data
        });
    }

    //genesis factory method
    static genesis() {
        return new this(
            GENESIS_DATA
        );
    }

}

module.exports = Block;

