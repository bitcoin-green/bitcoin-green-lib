'use strict';
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var _ = require('lodash');
var $ = require('../util/preconditions');
var isHexString = require('../util/js').isHexa;

var SimplifiedMNListEntry = require('./SimplifiedMNListEntry');
var Transaction = require('../transaction');
var constants = require('../constants');

/**
 * @typedef SimplifiedMNListDiff
 * @param {string} baseBlockHash - sha256
 * @param {string} blockHash - sha256
 * @param {CPartialMerkleTree} cbTxMerkleTree;
 * @param {CTransactionRef} cbTx;
 * @param {Array<string>} deletedMNs - sha256 hashes of deleted MNs
 * @param {Array<SimplifiedMNListEntry>} mnList
 */

/**
* @param {Buffer|Object|string} [arg] - A Buffer, JSON string, or Object representing a MnListDiff
* @class {SimplifiedMNListDiff}
* @constructor
*/
function SimplifiedMNListDiff(arg) {
  if (arg) {
    if (BufferUtil.isBuffer(arg)) {
      return SimplifiedMNListDiff.fromBuffer(arg);
    } else if (_.isObject(arg)) {
      return SimplifiedMNListDiff.fromObject(arg);
    } else if (isHexString(arg)) {
      return SimplifiedMNListDiff.fromHexString(arg);
    } else {
      throw new TypeError('Unrecognized argument passed to SimplifiedMNListDiff constructor');
    }
  }
}

/**
 * Creates MnListDiff from a Buffer.
 * @param {Buffer} buffer
 * @return {SimplifiedMNListDiff}
 */
SimplifiedMNListDiff.fromBuffer = function fromBuffer(buffer) {
  var bufferReader = new BufferReader(buffer);
  var data = {};

  data.baseBlockHash = bufferReader.read(constants.SHA256_HASH_SIZE).toString('hex');
  data.blockHash = bufferReader.read(constants.SHA256_HASH_SIZE).toString('hex');
  data.totalTransactions = bufferReader.readUInt32LE();

  var merkleHashesCount = bufferReader.readVarintNum();
  data.merkleHashes = [];
  for (var i = 0; i < merkleHashesCount; i++) {
    data.merkleHashes.push(bufferReader.read(constants.SHA256_HASH_SIZE).toString('hex'));
  }

  var merkleFlagsCount = bufferReader.readVarintNum();
  data.merkleFlags = bufferReader.read(merkleFlagsCount);

  data.cbTx = new Transaction().fromBufferReader(bufferReader);

  var deletedMNsCount = bufferReader.readVarintNum();
  data.deletedMNs = [];
  for (var i = 0; i < deletedMNsCount; i++) {
     data.deletedMNs.push(bufferReader.read(constants.SHA256_HASH_SIZE).toString('hex'));
  }

  var mnListSize = bufferReader.readVarintNum();
  data.mnList = [];
  for (var i = 0; i < mnListSize; i++) {
     data.mnList.push(SimplifiedMNListEntry.fromBuffer(bufferReader.read(91)));
  }

  return this.fromObject(data);
};

/**
 * @param {string} hexString
 * @return {SimplifiedMNListDiff}
 */
SimplifiedMNListDiff.fromHexString = function fromHexString(hexString) {
  return SimplifiedMNListDiff.fromBuffer(Buffer.from(hexString, 'hex'));
};

/**
 * Serializes mnlist diff to a Buffer
 * @return {Buffer}
 */
SimplifiedMNListDiff.prototype.toBuffer = function toBuffer() {
  var bufferWriter = new BufferWriter();

  bufferWriter.write(this.baseBlockHash);
  bufferWriter.write(this.blockHash);
  bufferWriter.writeVarintNum(this.totalTransactions);

  bufferWriter.writeVarintNum(this.merkleHashes.length);
  this.merkleHashes.forEach(function (hash) {
    bufferWriter.write(Buffer.from(hash, 'hex'));
  });

  bufferWriter.writeVarintNum(this.merkleFlags.length);
  bufferWriter.write(this.merkleFlags);

  this.cbTx.toBufferWriter(bufferWriter);

  bufferWriter.writeVarintNum(this.deletedMNs.length);
  this.deletedMNs.forEach(function (deleteMNHash) {
    bufferWriter.write(Buffer.from(deleteMNHash, 'hex'));
  });

  bufferWriter.writeVarintNum(this.mnList.length);
  this.mnList.forEach(function(simplifiedMNListEntry) {
    simplifiedMNListEntry.writeToBufferWriter(bufferWriter);
  });

  return bufferWriter.toBuffer();
};

/**
 * Creates MNListDiff from object
 * @param obj
 * @return {SimplifiedMNListDiff}
 */
SimplifiedMNListDiff.fromObject = function fromObject(obj) {
  var simplifiedMNListDiff = new SimplifiedMNListDiff();

  simplifiedMNListDiff.baseBlockHash = obj.baseBlockHash;
  simplifiedMNListDiff.blockHash = obj.blockHash;
  simplifiedMNListDiff.totalTransactions = obj.totalTransactions;
  // Copy array of strings
  simplifiedMNListDiff.merkleHashes = obj.merkleHashes.slice();

  // TODO: copy merkle flags
  simplifiedMNListDiff.merkleFlags = obj.merkleFlags;

  simplifiedMNListDiff.cbTx = Transaction.shallowCopy(obj.cbTx);

  // Copy array of strings
  simplifiedMNListDiff.deletedMNs = obj.deletedMNs.slice();

  simplifiedMNListDiff.mnList = obj.mnList.map(function(SMLEntry) {
    return SMLEntry.copy();
  });

  return simplifiedMNListDiff;
};

module.exports = SimplifiedMNListDiff;
