'use strict';
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var _ = require('lodash');
var $ = require('../util/preconditions');

var SimplifiedMNListEntry = require('./SimplifiedMNListEntry');
var CbTx = require('../transaction');
var constants = require('../constants');

/**
 * @typedef DeterministicMNListDiff
 * @param {string} prevBlockHash - sha256 hash, 32 bytes
 * @param {string} blockHash - sha256 hash, 32 bytes
 * @param {number} height
 * @param {Object.<string, Object>} addedMNs - list of added MNs
 * @param {Object.<string, Object>} updatedMNs - list of updated MNs
 * @param {Array<string>} removedMNs - list of hashes of removed MNs
 */

/**
* @param {*} arg - A Buffer, JSON string, or Object representing a MnListDiff
* @returns {DeterministicMNListDiff}
* @constructor
*/
function DeterministicMNListDiff(arg) {
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
  //     cbTx: null, //todo: CbTx.fromJSON() pending core bug
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
 * @param {Buffer} buf
 * @return {DeterministicMNListDiff}
 */
DeterministicMNListDiff.fromBuffer = function fromBuffer(buf) {
  var br = new BufferReader(buf);
  var info = {};
  info.baseBlockHash = br.read(constants.SHA256_HASH_SIZE).toString('hex');
  info.blockHash = br.read(constants.SHA256_HASH_SIZE).toString('hex');
  info.totalTransactions = br.readUInt32LE();

  info.merkleHashes = [];
  var merkleHashesCount = br.readVarintNum();
  for (var i = 0; i < merkleHashesCount; i++) {
    info.merkleHashes.push(br.read(constants.SHA256_HASH_SIZE).toString('hex'));
  }

  info.merkleFlags = [];
  var merkleFlagsCount = br.readVarintNum();
  for (var i = 0; i < merkleFlagsCount; i++) {
    info.merkleFlags.push(br.readUInt8());
  }

  var cbTxBuffer = br.readAll();
  info.cbTx = new CbTx(cbTxBuffer);

  // info.deletedMNs = []
  // for (var i = 0; i < br.readVarintNum(); i++) {
  //   info.deletedMNs.push(br.read(constants.SHA256_HASH_SIZE).toString('hex'));
  // }

  // info.mnList = []
  // for (var i = 0; i < br.readVarintNum(); i++) {
  //   info.mnList.push(SimplifiedMNListEntry.fromBufferReader(br.read(constants.mnDiffListTypes.SMLENTRY)));
  // }

  return info;
};

/**
 * Serializes mnlist diff to a Buffer
 * @return {Buffer}
 */
DeterministicMNListDiff.prototype.toBuffer = function toBuffer() {
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
 * @return {DeterministicMNListDiff}
 */
DeterministicMNListDiff.fromObject = function fromObject(obj) {
  return new DeterministicMNListDiff(obj);
};

module.exports = DeterministicMNListDiff;
