const redis = require('redis');

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {
    constructor( {blockchain} ) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels(Object.values(CHANNELS));

        this.subscriber.on('message', ( channel, message ) => this.handleMessage(channel, message))
    }

    subscribeToChannels( channels ) {
        channels.forEach(( channel ) => {
            this.subscriber.subscribe(channel);
        })
    }

    handleMessage( channel, message ) {
        const parsedMessage = JSON.parse(message);
        console.log(`Message received on channel: ${channel}`);
        if ( channel === CHANNELS.BLOCKCHAIN ) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    publish( {channel, message} ) {
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;