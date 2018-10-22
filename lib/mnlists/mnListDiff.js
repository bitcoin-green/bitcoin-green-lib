'use strict';
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var _ = require('lodash');
var $ = require('../util/preconditions');

var SmlEntry = require('./smlEntry');
var CbTx = require('../transaction');
var constants = require('../constants');

/* @param {*} - A Buffer, JSON string, or Object representing a MnListDiff
* @returns {MnListDiff}
* @constructor
*/
function MnListDiff(arg) {

  if (!(this instanceof MnListDiff)) {
    return new MnListDiff(arg);
  }

  var info = {};
  if (BufferUtil.isBuffer(arg)) {
    info = MnListDiff._fromBufferReader(BufferReader(arg));
  } else if (_.isObject(arg)) {
    info = {
      baseBlockHash: arg.baseBlockHash,
      blockHash: arg.blockHash,
      totalTransactions: arg.totalTransactions,
      merkleHashes: arg.merkleHashes,
      merkleFlags: arg.merkleFlags,
      cbTx: null, //todo: CbTx.fromJSON() pending core bug
      deletedMNs: arg.deletedMNs,
      mnList: arg.mnList.map(function (sml) {
        return SmlEntry.fromObject(sml);
      })
    }
  }
  else {
    throw new TypeError('Unrecognized argument for MnListDiff');
  }
  _.extend(this, info);
  this._flagBitsUsed = 0;
  this._hashesUsed = 0;
  return this;
}

MnListDiff._fromBufferReader = function _fromBufferReader(br) {

  $.checkState(!br.finished(), 'No mndifflist data received');
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
  //   info.mnList.push(SmlEntry.fromBufferReader(br.read(constants.mnDiffListTypes.SMLENTRY)));
  // }

  return info;
};

MnListDiff.prototype.toBufferWriter = function toBufferWriter(bw) {
  if (!bw) {
    bw = new BufferWriter();
  }

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
    bw.write(SmlEntry.toBufferWriter(this.mnList[i]));
  }

  return bw;
};

MnListDiff.prototype.toBuffer = function toBuffer() {
  return this.toBufferWriter().concat();
};

MnListDiff.fromObject = function fromObject(obj) {
  return new MnListDiff(obj);
};

MnListDiff.fromBufferReader = function fromBufferReader(br) {
  return new MnListDiff(MnListDiff._fromBufferReader(br));
};

MnListDiff.fromBuffer = function fromBuffer(buf) {
  return MnListDiff.fromBufferReader(BufferReader(buf));
};

module.exports = MnListDiff;
