const express = require('express');
const bodyParser = require('body-parser');

const {DEFAULT_PORT} = require('./config');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain: blockchain});

app.use(bodyParser.json());

// --------------------- END POINTS -----------------------

app.get('/api/blocks', ( req, res ) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', ( req, res ) => {
    const {data} = req.body;

    blockchain.addBlock({data});
    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

// --------------------------------------------------------

let PEER_PORT;
if ( process.env.GENERATE_PEER_PORT === 'true' ) {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Application started listening on port: ${PORT}`);
});