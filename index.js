'use strict'

const fs = require('fs')
const bencode = require('bencode')
const tracker = require('./tracker')

let torrent = fs.readFileSync('beast.torrent')

torrent = torrent.toString('utf-8')
const torrent = bencode.decode(fs.readFileSync('beast.torrent'))

console.log('torrent file data ', torrent)

tracker.getPeers(torrent, peers => {
  console.log('List of peers are ', peers)
})
