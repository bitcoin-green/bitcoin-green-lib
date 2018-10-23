'use strict';
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var _ = require('lodash');
var $ = require('../util/preconditions');

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
* @param {*} arg - A Buffer, JSON string, or Object representing a MnListDiff
* @returns {SimplifiedMNListDiff}
* @constructor
*/
function SimplifiedMNListDiff(arg) {
  //
  // var info = {};
  // if (BufferUtil.isBuffer(arg)) {
  //   info = DeterministicMNListDiff._fromBufferReader(BufferReader(arg));
  // } else if (_.isObject(arg)) {
  //   info = {
  //     baseBlockHash: arg.baseBlockHash,
  //     blockHash: arg.blockHash,
  //     totalTransactions: arg.totalTransactions,
  //     merkleHashes: arg.merkleHashes,
  //     merkleFlags: arg.merkleFlags,
  //     cbTx: null, //todo: Transaction.fromJSON() pending core bug
  //     deletedMNs: arg.deletedMNs,
  //     mnList: arg.mnList.map(function (sml) {
  //       return SimplifiedMNListEntry.fromObject(sml);
  //     })
  //   }
  // }
  // else {
  //   throw new TypeError('Unrecognized argument for MnListDiff');
  // }
  // _.extend(this, info);
  // this._flagBitsUsed = 0;
  // this._hashesUsed = 0;
  // return this;
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
  //data.merkleFlags = [];
  data.merkleFlags = bufferReader.read(merkleFlagsCount);
  // for (var i = 0; i < merkleFlagsCount; i++) {
  //   data.merkleFlags.push(bufferReader.readUInt8());
  // }

  // var cbTxBuffer = bufferReader.readAll();
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

  return data;
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
  var bw = new BufferWriter();
  bw.write(this.baseBlockHash);
  bw.write(this.blockHash);
  bw.writeVarintNum(this.totalTransactions);

  bw.writeVarintNum(this.merkleHashes.length);
  for (var i = 0; i < this.merkleHashes.length; i++) {
    bw.write(new Buffer(this.merkleHashes[i], 'hex'));
  }

  bw.writeVarintNum(this.merkleFlags.length);
  for (var i = 0; i < this.merkleFlags.length; i++) {
    bw.writeUInt8(this.merkleFlags[i]);
  }

  bw.write(this.cbTx.length);
  bw.write(this.cbTx);

  bw.writeVarintNum(this.deletedMNs.length);
  for (var i = 0; i < this.deletedMNs.length; i++) {
    bw.write(this.deletedMNs[i]);
  }

  bw.writeVarintNum(this.mnList.length);
  for (var i = 0; i < this.mnList.length; i++) {
    bw.write(SimplifiedMNListEntry.toBufferWriter(this.mnList[i]));
  }

  return bw.toBuffer();
};

/**
 * Creates MNListDiff from object
 * @param obj
 * @return {SimplifiedMNListDiff}
 */
SimplifiedMNListDiff.fromObject = function fromObject(obj) {
  return new SimplifiedMNListDiff(obj);
};

module.exports = SimplifiedMNListDiff;
