var expect = require('chai').expect;
var ip = require('../../lib/util/ip');

describe('ip', function () {

  describe('#ipAndPortToBuffer', function () {
    it('Should serialize ip and port to a buffer', function () {
      // c0a80001 - 192.168.0.1 as a hex string, 1771 is 6001 as UInt16BE
      var expectedBuffer = Buffer.from('000000000000000000000000c0a800011771', 'hex');
      var addressBuffer = ip.ipAndPortToBuffer('192.168.0.1:6001');
      var string = addressBuffer.toString('hex');

      // 16 for ipv6, and 2 bytes for the port
      expect(addressBuffer.length).to.be.equal(18);
      expect(addressBuffer).to.be.deep.equal(expectedBuffer);
    });
  });

  describe('#bufferToIpAndPort', function () {
    it('Should parse ip and port serialized to a binary', function () {
      var expectedAddressString = '192.168.0.1:6001';
      // c0a80001 - 192.168.0.1 as a hex string, 1771 is 6001 as UInt16BE
      var ipAndPortBuffer = Buffer.from('000000000000000000000000c0a800011771', 'hex');

      var addressString = ip.bufferToIPAndPort(ipAndPortBuffer);
      expect(addressString).to.be.equal(expectedAddressString);
    });
  });

});
