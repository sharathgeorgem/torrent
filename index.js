'use strict'

const tracker = require('./src/tracker')
const torrentParser = require('./src/torrent-parser')

const torrent = torrentParser.open('./torrentFiles/prog_rock.torrent')

console.log('torrent file data ', torrent)

tracker.getPeers(torrent, peers => {
  console.log('List of peers are ', peers)
})
