var SimplifiedMNListDiff = require('../../lib/mnlists/SimplifiedMNListDiff');
var expect = require('chai').expect;

var mnListDiffJSON = { baseBlockHash: '000008ca1832a4baf228eb1553c03d3a2c8e02399550dd6ea8d65cec3ef23d2e',
  blockHash: '000099b4ac444cc1489501d8207b507acd8732baf2179cab8003d6c1e8551a0d',
  deletedMNs: [],
  mnList:
    [ { proRegTxHash: '2f3bcf3db502eef52b923bbab96193fa1ccddc30a09b31437572cf9f0e0b313d',
      service: '54.169.153.33:12999',
      keyIDOperator: '36329cff992870bd0bfcc98995c1e42bafed5a22',
      keyIDVoting: '36329cff992870bd0bfcc98995c1e42bafed5a22',
      isValid: true },
      { proRegTxHash: 'f42336020cbdd64869d921c4388e79289a26a9719052d248761417f4b1964a40',
        service: '54.255.186.1:12999',
        keyIDOperator: '352c3e4e100fae54dac826c99d5ee385d749dd85',
        keyIDVoting: '352c3e4e100fae54dac826c99d5ee385d749dd85',
        isValid: true },
      { proRegTxHash: '90140bd33fb1e72e625a108e7b70602991ee25acff7ac6eede40f6e2c22f1952',
        service: '52.221.202.196:12999',
        keyIDOperator: 'a0c8eb0552c4c3f3c926aa8fddc0b9f62f1ff6f6',
        keyIDVoting: 'a0c8eb0552c4c3f3c926aa8fddc0b9f62f1ff6f6',
        isValid: true },
      { proRegTxHash: 'afe7efcfa6c1be170c1ab76af39e6569c2589ef99297a93db63a30f97c8b2c7c',
        service: '52.221.232.71:12999',
        keyIDOperator: '703ee76669a7c1040a8458917f2e9fac7378a227',
        keyIDVoting: '703ee76669a7c1040a8458917f2e9fac7378a227',
        isValid: true },
      { proRegTxHash: '3fbea01a4333e39b69d16f3cac9e8dd6e4bb595d154be26d06450c0157c45db1',
        service: '52.77.231.13:12999',
        keyIDOperator: '2b1f60cc1f92ce6bba2df51706c4352dc885c478',
        keyIDVoting: '2b1f60cc1f92ce6bba2df51706c4352dc885c478',
        isValid: true },
      { proRegTxHash: '4e6679374cf5c6267fc642a2148198400d87959457c50beb9fe4b7bb52ec61b3',
        service: '54.251.128.87:12999',
        keyIDOperator: 'b90d0b1696eeae0b6f4082d3b61280f8373eff80',
        keyIDVoting: 'b90d0b1696eeae0b6f4082d3b61280f8373eff80',
        isValid: true },
      { proRegTxHash: 'd696d0bf84181bead95c5408bf7e7b0e8b91f7d511ea447ef21992e5c3cd00bf',
        service: '54.169.131.115:12999',
        keyIDOperator: '352266a15fbf4ecde2d15ea1d37443747b3fad97',
        keyIDVoting: '352266a15fbf4ecde2d15ea1d37443747b3fad97',
        isValid: true },
      { proRegTxHash: 'd0c7c73560a024d75b19b9c935ae6110661e4afebaefe4b9bf02567e0d3543d4',
        service: '13.250.45.33:12999',
        keyIDOperator: '2ec4e386d2071273ba8126b6746e5aacebecf49c',
        keyIDVoting: '2ec4e386d2071273ba8126b6746e5aacebecf49c',
        isValid: true },
      { proRegTxHash: '8224c51fb25e1ed36a11a5b758a7acc67750ecf3d33db8e442d14d5b589d10d6',
        service: '54.169.142.72:12999',
        keyIDOperator: '0d64d0d2bb9f051d42df349351a880782048b131',
        keyIDVoting: '0d64d0d2bb9f051d42df349351a880782048b131',
        isValid: true },
      { proRegTxHash: 'fa06a320a1bb5c535c7e999e316c13578ca23557a349a32aa9635179ef2e28da',
        service: '54.255.164.83:12999',
        keyIDOperator: 'afe5a498728d6eca7af12687b242081f2270e31e',
        keyIDVoting: 'afe5a498728d6eca7af12687b242081f2270e31e',
        isValid: true },
      { proRegTxHash: '480db2f15b1b15cc0330ce1b0033397e8abc038a7bb642c7486379e149b2e3e0',
        service: '13.229.233.231:12999',
        keyIDOperator: 'f98778e696eb81523d6b03a8c88538cfe2d5241c',
        keyIDVoting: 'f98778e696eb81523d6b03a8c88538cfe2d5241c',
        isValid: true },
      { proRegTxHash: '3a5c3a4b15611853ee0c57ce0af4a7322bcc4f63d5842714ebd203d4596854e6',
        service: '13.250.100.254:12999',
        keyIDOperator: '3f8c1a853e02b9cce69014c6f7441202dd1f64af',
        keyIDVoting: '3f8c1a853e02b9cce69014c6f7441202dd1f64af',
        isValid: true },
      { proRegTxHash: 'a40201655357edcdc97211ee65cb3e010632911b0c29ecf8f5cc6b533120f3ef',
        service: '13.229.70.109:12999',
        keyIDOperator: '7d6df3c3817acc8eddb34ffa14db9f0f3ffc3798',
        keyIDVoting: '7d6df3c3817acc8eddb34ffa14db9f0f3ffc3798',
        isValid: true },
      { proRegTxHash: 'd0ce01ea65028e6fd8f93cfcf8c371c822a5a9ae2ec35a5954faab7ed11e26f2',
        service: '13.250.14.191:12999',
        keyIDOperator: 'fb830cbd774f5c36971276d8d2cd1b486c4d79a7',
        keyIDVoting: 'fb830cbd774f5c36971276d8d2cd1b486c4d79a7',
        isValid: true },
      { proRegTxHash: 'fc7708d6ccaf62758626ccc6652ff60f225890c311716c58add6ce606d737fff',
        service: '52.77.220.9:12999',
        keyIDOperator: 'b460318baf09faab30ad2d887c0df390340dcd3f',
        keyIDVoting: 'b460318baf09faab30ad2d887c0df390340dcd3f',
        isValid: true } ],
  merkleRootMNList: '46baff3f39d460aa5540ea2290435931e2826c9409e2a1783cb529b7a80f0169' };

var mnListDiffData = '0000000000000000000000000000000000000000000000000000000000000000a022418a003b689b9b82c23473ef8df189fbb2c03b3f9cf3b53c0160fc966e190100000001ef45ec04d27938efb81184f97ceab908dbb66245c2dbffdf97b82b92bcddbd6e010103000500010000000000000000000000000000000000000000000000000000000000000000ffffffff050290070101ffffffff0200c11a3d05000000232103eead733a081b6559bbe32c3a0c55ce861614df5b5c69b65125072e59339ce547ac00c11a3d050000001976a914c490201bdda0e64e3e1d8bdd6bbf7d80686f0e8588ac0000000024900700006c45528d7b8d4e7a33614a1c3806f4faf5c463f0b313aa0ece1ce12c34154a44000e16e11b50a91d95a82f64283edd47b890baf8a74af3d408206111574cb8b32a1600000000000000000000ffff34dde84732c7827b241e43c47dbac1fb5697409a537fca3424a4827b241e43c47dbac1fb5697409a537fca3424a401368d37774de9e4694b94caff82737b72b3914e70f8d34905b644491ddf4dc42400000000000000000000ffff34ddcac432c7454921eb604faad14ab5772a1738b648c27d7b0b454921eb604faad14ab5772a1738b648c27d7b0b013c692906f231771f2e1c19a15c2863a9c04b864ff2c45bd0fd46f91231a38bad00000000000000000000ffff36a98e4832c71344d247bc20849a10e025dea103790f45addd951344d247bc20849a10e025dea103790f45addd9501451ecdfdbb5ac685f56ec547d62174fbc5cd0b268a908d8336573b34c978ab6800000000000000000000ffff344de70d32c71d33b834ffbd8a4fa1dc8cf951d4c660d9b057a81d33b834ffbd8a4fa1dc8cf951d4c660d9b057a80146cb295d8deb1ca477d0bbb714299b49cddbd13d7683adb5b45773280ed9f43100000000000000000000ffff36fb805732c73b268262cb533fa71c8d201ac95b47d7b9dc235d3b268262cb533fa71c8d201ac95b47d7b9dc235d015192c6531b6cc9acb5d39e7724c5dd45ebbafc6ad506d43db3c94f4bc5bf842c00000000000000000000ffff344ddc0932c786b1026279914cf9bf9c7e09bdf4e11e32efa81686b1026279914cf9bf9c7e09bdf4e11e32efa81601535aca9cde16ebc6d6a51914b6c524044df6d6a87ec7c23c3dc7f355ff445fb500000000000000000000ffff36ffba0132c713a15c179c1aa56bd6f7823a82adf121d26fae7113a15c179c1aa56bd6f7823a82adf121d26fae71016572053adbdc2d1ae4955b2c1574366d8b2f9e2734144632030e4c832792292900000000000000000000ffff36a9837332c706c1a2a01cabcb73328a0c1581c708e302836aaf06c1a2a01cabcb73328a0c1581c708e302836aaf01662d6de9ed5a85646ebf9e04b63537993be345ed28ebd253c8c0bda5a325ef8700000000000000000000ffff0dfa0ebf32c7def5bfceb759577766dc3029fd8080ad07baa70cdef5bfceb759577766dc3029fd8080ad07baa70c01675ebde16c8719292812b68ed422fefc2a4f74461b6e7af20acf9b676c65082a00000000000000000000ffff0dfa64fe32c7028aee2a88678d9e7d068284e87eac794a3d6501028aee2a88678d9e7d068284e87eac794a3d6501016d8fd38216a9d76492fad8e72f0ba161784bcf5f888ab66daceca75db3dabfc200000000000000000000ffff0de5e9e732c771915a515a000d0080800b735b439598d1f3c3b071915a515a000d0080800b735b439598d1f3c3b00197855159eaadf7e3d0f6fc0b2ffdaaad2a5ffeb1e858fa88d979f3c2042132cd00000000000000000000ffff0dfa2d2132c79fcc35836c2ed6b477a3323a37128eb70cb4ff039fcc35836c2ed6b477a3323a37128eb70cb4ff0301a921e6d02823147dda734f8a0bef79d2ccc94cd4e3dc06d5378cbfb051b4a12400000000000000000000ffff0de5466d32c74fab17021bd32fd24492187a1205a28247ff1f864fab17021bd32fd24492187a1205a28247ff1f8601aa0e74b6f56eebbf55849f7fc40bf2f163d57e0752a6f724554f6e12fd4ad3f300000000000000000000ffff36ffa45332c7b9d093370f55b4196374e0d83ff11a2259589abcb9d093370f55b4196374e0d83ff11a2259589abc01';

describe('SimplifiedMNListDiff', function () {
  it('Should be able to parse a serialized simplified MN list ', function () {
    var simplifiedMNListDiff = SimplifiedMNListDiff.fromHexString(mnListDiffData);
    expect(simplifiedMNListDiff.baseBlockHash).to.be.equal('3f4a8012763b1d9b985cc77b0c0bca918830b1ef7dd083665bdc592c2cd31cf6');
    expect(simplifiedMNListDiff.blockHash).to.be.equal('000004543e350b99f43114fe0bf649344a28f4fde6785d80e487d90689ae3918');
    expect(simplifiedMNListDiff.totalTransactions).to.be.equal(1);
    expect(simplifiedMNListDiff.deletedMNs.length).to.be.equal(0);

    //Todo replace undefined after core bugfix
    // simplifiedMNListDiff.merkleFlags.should.equal(xxx)
    // simplifiedMNListDiff.merkleHashes.should.equal(xxx)
    // simplifiedMNListDiff.totalTransactions.should.equal(xxx)

    simplifiedMNListDiff.mnList.length.should.equal(3);
  });

  it('Should restore parsed data to the same form', function () {
    var simplifiedMNListDiff = SimplifiedMNListDiff.fromHexString(mnListDiffData);
    expect(simplifiedMNListDiff.toBuffer().toString('hex')).to.be.equal(mnListDiffData)
  });

});
