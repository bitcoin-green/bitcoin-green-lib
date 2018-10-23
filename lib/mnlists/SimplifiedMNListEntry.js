'use strict';
var _ = require('lodash');
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var $ = require('../util/preconditions');
var Hash = require('../crypto/hash');
var constants = require('../constants');
var utils = require('../util/js');

var isSha256 = utils.isSha256HexString;
var isUnsignedInteger = utils.isUnsignedInteger;
var isHexStringOfSize = utils.isHexStringOfSize;

var IP_ADDRESS_SIZE = constants.IP_ADDRESS_SIZE;
var SHA256_HASH_SIZE = constants.SHA256_HASH_SIZE;
var PUBKEY_ID_SIZE = constants.PUBKEY_ID_SIZE;
var BOOL_SIZE = constants.primitives.BOOLEAN;

/**
 * @typedef {Object} SMLEntry
 * @property {string} proRegTxHash uint256
 * @property {string} ipAddress
 * @property {number} port
 * @property {string} keyIDOperator - public key hash, 20 bytes
 * @property {string} keyIDVoting - public key hash, 20 bytes
 * @property {boolean} isValid
 */

/**
 * @class SimplifiedMNListEntry
 * @param {*} arg - A Buffer, JSON string, or Object representing a SmlEntry
 * @constructor
 * @property {string} proRegTxHash uint256
 * @property {string} ipAddress
 * @property {number} port
 * @property {string} keyIDOperator - public key hash, 20 bytes
 * @property {string} keyIDVoting - public key hash, 20 bytes
 * @property {boolean} isValid
 */
function SimplifiedMNListEntry(arg) {
  if (arg) {
    if (BufferUtil.isBuffer(arg)) {
      return this.fromBuffer(arg);
    } else if (_.isObject(arg)) {
      return this.fromObject(arg);
    }
    else {
      throw new TypeError('Unrecognized argument for SimplifiedMNListEntry');
    }
  }
}

/**
 * Parses an SMLEntry buffer
 * @param {Buffer} buffer
 */
SimplifiedMNListEntry.fromBuffer = function fromBuffer(buffer) {
  var bufferReader = new BufferReader(buffer);

  return SimplifiedMNListEntry.fromObject({
    proRegTxHash: bufferReader.read(SHA256_HASH_SIZE).toString('hex'),
    ipAddress: bufferReader.read(IP_ADDRESS_SIZE).toString('hex'),
    port: Number(bufferReader.readUInt16BE()),
    keyIDOperator: bufferReader.read(PUBKEY_ID_SIZE).toString('hex'),
    keyIDVoting: bufferReader.read(PUBKEY_ID_SIZE).toString('hex'),
    isValid: Boolean(Number(bufferReader.read(BOOL_SIZE)))
  });
};

/**
 * Serialize SML entry to buffer
 * @return {Buffer}
 */
SimplifiedMNListEntry.prototype.toBuffer = function toBuffer() {
  this.validate();
  var bufferWriter = new BufferWriter();

  bufferWriter.write(Buffer.from(this.proRegTxHash, 'hex'));
  bufferWriter.write(Buffer.from(this.ipAddress, 'hex'));
  bufferWriter.writeUInt16BE(this.port);
  bufferWriter.write(Buffer.from(this.keyIDOperator, 'hex'));
  bufferWriter.write(Buffer.from(this.keyIDVoting, 'hex'));
  bufferWriter.write(this.isValid);

  return bufferWriter.toBuffer();
};

/**
 * Create SMLEntry from an object
 * @param {SMLEntry} obj
 * @return {SimplifiedMNListEntry}
 */
SimplifiedMNListEntry.fromObject = function fromObject(obj) {
  var SMLEntry = new SimplifiedMNListEntry();
  SMLEntry.proRegTxHash = obj.proRegTxHash;
  SMLEntry.ipAddress = obj.ipAddress;
  SMLEntry.port = obj.port;
  SMLEntry.keyIDOperator = obj.keyIDOperator;
  SMLEntry.keyIDVoting = obj.keyIDVoting;
  SMLEntry.isValid = obj.isValid;

  SMLEntry.validate();
  return SMLEntry;
};

SimplifiedMNListEntry.prototype.validate = function validate() {
  $.checkArgument(isSha256(this.proRegTxHash), 'Expect proRegTxHash to be a sha256 hex string');
  $.checkArgument(isHexStringOfSize(this.ipAddress, IP_ADDRESS_SIZE * 2), 'Expect ipv6 to be a 16 byte hex string');
  $.checkArgument(isUnsignedInteger(this.port), 'Expect port to be an unsigned integer');
  $.checkArgument(isHexStringOfSize(this.keyIDOperator, PUBKEY_ID_SIZE * 2), 'Expect keyIDOperator to be a pubkey id');
  $.checkArgument(isHexStringOfSize(this.keyIDVoting, PUBKEY_ID_SIZE * 2), 'Expect keyIDOperator to be a pubkey id');
  $.checkArgument(typeof this.isValid === 'boolean', 'Expect isValid to be a boolean');
};

/**
 * @return {Buffer}
 */
SimplifiedMNListEntry.prototype.getHash = function hash() {
  return Hash.sha256sha256(this.toBuffer());
};

module.exports = SimplifiedMNListEntry;
