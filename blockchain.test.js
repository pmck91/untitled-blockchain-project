const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain = new Blockchain();
    let originalChain = blockchain.chain;
    let newChain = new Blockchain();

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with a genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const newData = 'fooBarr';

        blockchain.addBlock({
            data: newData
        });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                // overwrite the genesis block
                blockchain.chain[0] = {data: 'fake-block'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {

            beforeEach(() => {
                // add some data to the chain for the tests
                blockchain.addBlock({data: 'data - 1'});
                blockchain.addBlock({data: 'data - 2'});
                blockchain.addBlock({data: 'data - 3'});
                blockchain.addBlock({data: 'data - 4'});
            });

            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    // break a last hash value in the chain
                    blockchain.chain[2].lastHash = 'broken-hash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with invalid data', () => {
                it('returns false', () => {
                    // break the has for a block by modifying the data
                    blockchain.chain[1].data = 'broken-data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () => {

        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {

            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'};
                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
               expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', () => {

            beforeEach(() => {
                // add some data to the chain for the tests
                newChain.addBlock({data: 'data - 1'});
                newChain.addBlock({data: 'data - 2'});
                newChain.addBlock({data: 'data - 3'});
                newChain.addBlock({data: 'data - 4'});
                newChain.addBlock({data: 'data - 5'});
            });

            describe('and the chain is invalid', () => {

                beforeEach(() => {
                    newChain.chain[2].hash = 'broken-hash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacment', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});