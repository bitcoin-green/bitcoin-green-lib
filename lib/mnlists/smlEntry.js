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
      isValid: arg.isValid,
      keyIDOperator: arg.keyIDOperator,
      keyIDVoting: arg.keyIDVoting,
      proRegTxHash: arg.proRegTxHash,
      service: arg.service
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
  info.isValid = Boolean(Number(br.read(constants.primatives.BOOLEAN)))

  return info;
};

SmlEntry.prototype.toBufferWriter = function toBufferWriter(bw) {
  if (!bw) {
    bw = new BufferWriter();
  }

  bw.write(new Buffer.from(this.proRegTxHash, 'hex'));

  bw.write(new Buffer(this.service.split(':')[0]))
  bw.writeUInt16LE(this.service.split(':')[1])

  bw.write(new Buffer(this.keyIDOperator, 'hex'))
  bw.write(new Buffer(this.keyIDVoting, 'hex'))

  bw.write(new Buffer(this.isValid ? '1' : '0', 'binary'))

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

SmlEntry.prototype.getHash = function hash() {
  return Hash.sha256(this.toBuffer());
};

module.exports = SmlEntry;
