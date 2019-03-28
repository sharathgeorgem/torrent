'use strict'

const tracker = require('./tracker')
const torrentParser = require('./torrent-parser')

const torrent = torrentParser.open('beast.torrent')

console.log('torrent file data ', torrent)

tracker.getPeers(torrent, peers => {
  console.log('List of peers are ', peers)
})
