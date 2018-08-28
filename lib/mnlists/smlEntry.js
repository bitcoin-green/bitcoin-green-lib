'use strict';
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var _ = require('lodash');
var $ = require('../util/preconditions');
var Hash = require('../crypto/hash');

const constants = require('../constants')

/* @param {*} - A Buffer, JSON string, or Object representing a SmlEntry
* @returns {SmlEntry}
* @constructor
*/
function SmlEntry(arg) {

  if (!(this instanceof SmlEntry)) {
    return new SmlEntry(arg);
  }

  var info = {};
  if (BufferUtil.isBuffer(arg)) {
    info = SmlEntry._fromBufferReader(BufferReader(arg));
  } else if (_.isObject(arg)) {
    info = {
      proRegTxHash: arg.baseBlockHash,
      ipAddress: arg.blockHash,
      port: arg.totalTransactions,
      keyIDOperator: arg.merkleHashes,
      keyIDVoting: arg.merkleFlags,
      isValid: arg.cbTx,
    }
  }
  else {
    throw new TypeError('Unrecognized argument for SmlEntry');
  }
  _.extend(this, info);
  this._flagBitsUsed = 0;
  this._hashesUsed = 0;
  return this;
}

SmlEntry._fromBufferReader = function _fromBufferReader(br) {
  $.checkState(!br.finished(), 'No smlentry data received');
  var info = {};
  info.proRegTxHash = br.read(constants.SHA256_HASH_SIZE).toString('hex');

  const ipv6 = [];
  for (var a = 0; a < 8; a++) {
    var word = parser.read(2);
    ipv6.push(word.toString('hex'));
  }
  info.ip = ipv6;

  info.port = br.readUint16LE()

  info.keyIDOperator = br.read(constants.PUBKEY_ID_SIZE)
  info.keyIDVoting = br.read(constants.PUBKEY_ID_SIZE) 
  info.isValid = br.read(constants.primatives.BOOLEAN)

  return info;
};

SmlEntry.prototype.toBufferWriter = function toBufferWriter(bw) {
  if (!bw) {
    bw = new BufferWriter();
  }

  bw.write(this.proRegTxHash);

  var words = this.ip.split(':').map((s) => new Buffer(s, 'hex'));
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    bw.write(word);
  }

  bw.writeUInt16LE(this.port)

  bw.write(BufferUtil.copy(this.keyIDOperator)) 
  bw.write(BufferUtil.copy(this.keyIDVoting)) 

  bw.write(BufferUtil.copy(this.isValid))

  return bw;
};

SmlEntry.prototype.toBuffer = function toBuffer() {
  return this.toBufferWriter().concat();
};

SmlEntry.fromObject = function fromObject(obj) {
  return new SmlEntry(obj);
};

SmlEntry.fromBufferReader = function fromBufferReader(br) {
  return new SmlEntry(SmlEntry._fromBufferReader(br));
};

SmlEntry.fromBuffer = function fromBuffer(buf) {
  return SmlEntry.fromBufferReader(BufferReader(buf));
};

BlockHeader.prototype._getHash = function hash() {
  return Hash.sha256(this.toBuffer());
};

module.exports = SmlEntry;
