const mnListDiffData = require('./data');
const MnListDiff = require('../../lib/mnlists/mnListDiff')
const should = require('chai').should();

describe('MnListDiff', () => {
    let mnlistdiff = null;
    before(() => {
        mnlistdiff = new MnListDiff(mnListDiffData)
    });

    it('should initialise mnlistdiff from json args', () => {
        mnlistdiff.baseBlockHash.should.equal('3f4a8012763b1d9b985cc77b0c0bca918830b1ef7dd083665bdc592c2cd31cf6');
        mnlistdiff.blockHash.should.equal('000004543e350b99f43114fe0bf649344a28f4fde6785d80e487d90689ae3918');
        mnlistdiff.deletedMNs.length.should.equal(0);

        //Todo replace undefined after core bugfix
        // mnlistdiff.merkleFlags.should.equal(xxx)
        // mnlistdiff.merkleHashes.should.equal(xxx)
        // mnlistdiff.totalTransactions.should.equal(xxx)

        mnlistdiff.mnList.length.should.equal(3);
    });

    it('should initialise smlentry from json args', () => {
        const smlEntry = mnlistdiff.mnList[0]
        smlEntry.isValid.should.equal(true);
        smlEntry.keyIDOperator.should.equal('43ce12751c4ba45dcdfe2c16cefd61461e17a54d');
        smlEntry.keyIDVoting.should.equal('43ce12751c4ba45dcdfe2c16cefd61461e17a54d');
        smlEntry.proRegTxHash.should.equal('f7737beb39779971e9bc59632243e13fc5fc9ada93b69bf48c2d4c463296cd5a');
        smlEntry.service.should.equal('207.154.244.13:19999');
    });

    it('should initialise cbTx from json args', () => {
        //Todo pending core bug
    });
});
