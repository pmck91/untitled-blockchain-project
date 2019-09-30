
// new blocks to be mined at a rate of 1 second
const MINE_RATE = 500;

// this initial difficulty will be dynamically overridden to keep to the mine rate
const INITIAL_DIFFICULTY = 3;

// initial block on the chain
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, INITIAL_DIFFICULTY, MINE_RATE };