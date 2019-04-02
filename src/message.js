'use strict'

const Buffer = require('buffer').Buffer
const torrentParser = require('./torrent-parser')
const peerId = require('./peer-id')

module.exports.buildHandshake = torrent => {
  const buf = Buffer.alloc(68)

  buf.writeUInt8(19, 0)
  buf.write('BitTorrent protocol', 1)
  buf.writeUInt32BE(0, 20)
  buf.writeUInt32BE(0, 24)
  torrentParser.infoHash(torrent).copy(buf, 28)
  buf.write(peerId.genId())

  return buf
}

module.exports.buildKeepAlive = () => Buffer.alloc(4)

module.exports.buildChoke = () => {
  const buf = Buffer.alloc(5)
  buf.writeUInt32BE(1, 0)
  buf.writeUInt8(0, 4)
  return buf
}

module.exports.buildUnchoke = () => {
  const buf = Buffer.alloc(5)
  buf.writeUInt32BE(1, 0)
  buf.writeUInt8(1, 4)
  return buf
}

module.exports.buildInterested = () => {
  const buf = Buffer.alloc(5)
  buf.writeUInt32BE(1, 0)
  buf.writeUInt8(2, 4)
  return buf
}

module.exports.buildNotInterested = () => {
  const buf = Buffer.alloc(5)
  buf.writeUInt32BE(1, 0)
  buf.writeUInt8(3, 4)
  return buf
}

module.exports.buildHave = payload => {
  const buf = Buffer.alloc(9)
  buf.writeUInt32BE(5, 0)
  buf.writeUInt8(4, 4)
  buf.writeUInt32BE(payload, 5)
}

module.exports.buildBitField = (bitfield, payload) => {
  const buf = Buffer.alloc(14)
  buf.writeUInt32BE(payload.length + 1, 0)
  buf.writeUInt8(5, 4)
  bitfield.copy(buf, 5)
  return buf
}

module.exports.buildRequest = payload => {
  const buf = Buffer.alloc(17)
  buf.writeUInt32BE(13, 0)
  buf.writeUInt8(6, 4)
  buf.writeUInt32BE(payload.index, 5)
  buf.writeUInt32BE(payload.begin, 9)
  buf.writeUInt32BE(payload.length, 13)
  return buf
}

module.exports.buildPiece = payload => {
  const buf = Buffer.alloc(payload.block.length + 13)
  buf.writeUInt32BE(payload.block.length + 9, 0)
  buf.writeUInt8(7, 4)
  buf.writeUInt32BE(payload.index, 5)
  buf.writeUInt32BE(payload.begin, 9)
  payload.block.copy(buf, 13)
  return buf
}

module.exports.buildCancel = payload => {
  const buf = Buffer.alloc(17)
  buf.writeUInt32BE(13, 0)
  buf.writeUInt8(8, 4)
  buf.writeUInt32BE(payload.index, 5)
  buf.writeUInt32(payload.begin, 9)
  buf.writeUInt32BE(payload.length, 13)
  return buf
}

module.exports.buildPort = payload => {
  const buf = Buffer.alloc(7)
  buf.writeUInt32BE(3, 0)
  buf.writeUInt8(9, 4)
  buf.writeUInt16BE(payload, 5)
  return buf
}
