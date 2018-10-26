var constants = require('../constants');

/**
 * Maps ipv4:port to ipv6 buffer and port
 * @param {string} string
 * @return {Buffer}
 */
function ipAndPortToBuffer(string) {
  return Buffer.from(string);
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
 * @param string
 * @return {boolean}
 */
function isIpV4(string) {
  return false;
}

var ip = {
  isIPV4: isIpV4,
  ipAndPortToBuffer: ipAndPortToBuffer,
  bufferToIPAndPort: bufferToIPAndPort,
  IP_AND_PORT_SIZE: constants.ipAddresses.IPV4MAPPEDHOST + constants.ipAddresses.PORT
};

module.exports = ip;
