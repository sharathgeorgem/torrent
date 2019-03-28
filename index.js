'use strict'

const fs = require('fs')
const bencode = require('bencode')
const tracker = require('./tracker')

const torrent = bencode.decode(fs.readFile('beast.torrent'))

console.log('torrent file data ', torrent)

tracker.getPeers(torrent, peers => {
  console.log('List of peers are ', peers)
})
