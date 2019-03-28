'use strict'

const fs = require('fs')
const bencode = require('bencode')
const crypto = require('crypto')
const bignum = require('bignum')

module.exports.open = (filepath) => {
  return bencode.decode(fs.readFileSync(filepath))
}

module.exports.size = torrent => {
  // For torrent containing single file or multiple files.
  const size = torrent.info.files
    ? torrent.info.files.map(file => file.length).reduce((a, b) => a + b)
    : torrent.info.length
  return bignum.toBuffer(size, {size: 8})
}

module.exports.infoHash = torrent => {
  const info = bencode.encode(torrent.info)
  // Create Hash object using sha1 algorithm ==> Ret
  // Updates the hash with the data provided
  // Digest returns a buffer if no encoding is specified

  return crypto.createHash('sha1').update(info).digest()
}
