const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock( {data} ) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[ this.chain.length - 1 ],
            data: data
        });

        this.chain.push(newBlock);
    }

    replaceChain( chain ) {
        if ( chain.length <= this.chain.length ) {
            console.error('the incoming chain must be longer than the current chain');
            return;
        }
        if ( !Blockchain.isValidChain(chain) ) {
            console.error('the incoming chain must be valid');
            return;
        }

        console.log('replacing chain with incoming chain: ', chain);
        this.chain = chain;
    }

    static isValidChain( chain ) {
        if ( JSON.stringify(chain[ 0 ]) !== JSON.stringify(Block.genesis()) ) {
            return false;
        }

        for ( let i = 1; i < chain.length; i++ ) {
            const lastDifficulty = chain[ i - 1 ].difficulty;
            const {timestamp, lastHash, hash, data, nonce, difficulty} = chain[ i ];
            if ( Math.abs(lastDifficulty - difficulty) > 1 && lastDifficulty !== difficulty ) {
                return false;
            }
            const actualLastHash = chain[ i - 1 ].hash;
            if ( lastHash !== actualLastHash ) {
                return false;
            }
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if ( hash !== validatedHash ) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;