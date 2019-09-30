
// new blocks to be mined at a rate of 1 second
const MINE_RATE = 1000;

// this initial difficulty will be dynamically overridden to keep to the mine rate
const INITIAL_DIFFICULTY = 5;

// initial block on the chain
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const DEFAULT_PORT = 3000;

module.exports = {GENESIS_DATA, INITIAL_DIFFICULTY, MINE_RATE, DEFAULT_PORT};