var BufferWriter = require('../encoding/bufferwriter');
var constants = require('../constants');
var serviceRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/g;

/**
 * Maps ipv4:port to ipv6 buffer and port
 * Note: this is made mostly for the deterministic masternode list, which are ipv4 addresses encoded as ipv6 addresses
 * @param {string} string
 * @return {Buffer}
 */
function ipAndPortToBuffer(string) {
  var split = string.split(':');
  var addressBytes = split[0].split('.');
  var port = Number(split[1]);
  var addressWriter = new BufferWriter();
  var ipV6prefix = new Buffer(12);

  addressBytes.forEach(function(byte) {
    var str = Number(byte).toString(16);
    if (str.length === 1) {
      str = '0' + str;
    }
    addressWriter.write(Buffer.from(str, 'hex'));
  });

  var bufferWriter = new BufferWriter();
  bufferWriter.write(ipV6prefix);
  bufferWriter.write(addressWriter.toBuffer());
  bufferWriter.writeUInt16BE(port);
  return bufferWriter.toBuffer();
}

/**
 * Parses ipv6 buffer and port to ipv4:port string
 * @param {Buffer} buffer
 * @return {string}
 */
function bufferToIPAndPort(buffer) {
  return '';
}

/**
 * Checks if string is an ipv4 address
 * @param {string} ipAndPortString
 * @return {boolean}
 */
function isIpV4(ipAndPortString) {
  return serviceRegex.test(ipAndPortString)
}

var ip = {
  isIPV4: isIpV4,
  ipAndPortToBuffer: ipAndPortToBuffer,
  bufferToIPAndPort: bufferToIPAndPort,
  IP_AND_PORT_SIZE: constants.ipAddresses.IPV4MAPPEDHOST + constants.ipAddresses.PORT
};

module.exports = ip;
