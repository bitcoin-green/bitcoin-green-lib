var BufferWriter = require('../encoding/bufferwriter');
var BufferReader = require('../encoding/bufferreader');
var constants = require('../constants');
var serviceRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/;
var ipV6prefix = new Buffer(12);
var emptyAddress = new Buffer(18);

/**
 * Maps ipv4:port to ipv6 buffer and port
 * Note: this is made mostly for the deterministic masternode list, which are ipv4 addresses encoded as ipv6 addresses
 * @param {string} string
 * @return {Buffer}
 */
function ipAndPortToBuffer(string) {
  if (isZeroAddress(string)) {
    return emptyAddress.slice();
  }
  var split = string.split(':');
  var addressBytes = split[0].split('.');
  var port = Number(split[1]);
  var addressWriter = new BufferWriter();
  // As we are going to serialize ipv4 to ipv6 format, we need 12 zero bytes prefix

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
  var bufferReader = new BufferReader(buffer);
  var ipV6Buffer = bufferReader.read(constants.IP_ADDRESS_SIZE);
  var port = bufferReader.readUInt16BE();

  if (!bufferReader.finished()) {
    throw new Error('Ip buffer is too big. Expected size is 18 bytes');
  }

  // To get ipv4 bytes, we need to ignore first 12 bytes of ipv6
  var ipV4DecimalBytes = Array.prototype.slice.call(ipV6Buffer.slice(12, 16));
  var ipV4string = ipV4DecimalBytes.join('.');
  return ipV4string + ':' + String(port);
}

/**
 * Checks if string is an ipv4 address
 * @param {string} ipAndPortString
 * @return {boolean}
 */
function isIpV4(ipAndPortString) {
  return serviceRegex.test(ipAndPortString);
}

/**
 * @param {string} address
 * @return {boolean}
 */
function isZeroAddress(address) {
  return address === constants.EMPTY_IP_ADDRESS;
}

var ip = {
  isIPV4: isIpV4,
  ipAndPortToBuffer: ipAndPortToBuffer,
  bufferToIPAndPort: bufferToIPAndPort,
  isZeroAddress: isZeroAddress,
  IP_AND_PORT_SIZE: constants.ipAddresses.IPV4MAPPEDHOST + constants.ipAddresses.PORT
};

module.exports = ip;
