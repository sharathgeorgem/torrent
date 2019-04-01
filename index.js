'use strict'

const download = require('./src/download')
const tracker = require('./src/tracker')
const torrentParser = require('./src/torrent-parser')

const torrent = torrentParser.open(process.argv[2])

download(torrent)

tracker.getPeers(torrent, peers => {
  console.log('List of peers are ', peers)
})
