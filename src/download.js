'use strict'

const net = require('net')
const Buffer = require('buffer').Buffer
const tracker = require('./tracker')
const message = require('./message')

module.exports = torrent => {
  tracker.getPeers(torrent, peers => {
    peers.forEach(peer => download(peer, torrent))
  })
}

function download (peer, torrent) {
  const socket = new net.Socket()
  socket.on('error', console.log)
  socket.connect(peer.port, peer.ip, () => {
    socket.write(message.buildHandshake(torrent))
  })
  onWholeMessage(socket, msg => messageHandler(msg, socket))
}

// Receives message, checks id, passes to appropriate handler function

function messageHandler (msg, socket) {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested())
  }
  else {
    const m =  message.parse(msg)

    if(m.id === 0) chokeHandler()
    if(m.id === 1) unchokeHandler()
    if(m.id === 4) haveHandler(m.payload)
    if(m.id === 5) bitFieldHandler(m.payload)
    if(m.id === 7) pieceHandler(m.payload)
  }
}

function chokeHandler () {}

function unchokeHandler () {}

function haveHandler(payload) {}

function bitFieldHandler (payload) {}

function pieceHandler (payload) {}

function isHandshake (msg) {
  return msg.length === msg.readUInt8(0) + 49 &&
    msg.toString('utf8', 1) === 'BitTorrent protocol'
}

function onWholeMessage(socket, callback) {
  let savedBuf = Buffer.alloc(0)
  let handshake = true

  socket.on('data', receiveBuf => {
    const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4
    savedBuf = Buffer.concat([savedBuf, receiveBuf])

    while(savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
      callback(savedBuf.slice(0, msgLen()))
      savedBuf = savedBuf.slice(msgLen())
      handshake = false
    }
  })
}
