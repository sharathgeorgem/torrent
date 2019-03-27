'use strict'

const dgram = require('dgram')
const urlParse = require('url').parse()

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4')
  const url = torrent.announce.toString('utf-8')

  udpSend(socket, buildConnectionRequest(), url)

  socket.on('message', response => {
    if (responseType(response) === 'connect') {
      const connectionResponse = parseConnectionResponse(response)
      const announceRequest = buildAnnounceRequest(connectionResponse.connectionId)
      console.log(response)
      udpSend(socket, announceRequest, url)

    } else if (responseType(response) === 'announce') {
      console.log(response)
      const announceResponse = parseAnnounceResponse(response)
      callback(announceResponse.peers)
    }
  })
}

function udpSend (socket, message, rawURL, callback = () => {}) {
  const url = urlParse(rawURL)
  socket.send(message, 0, message.length, url.port, url.host, callback)
}

function responseType (response) {}

function buildConnectionRequest () {}

function parseConnectionResponse () {}

function buildAnnounceRequest () {}

function parseAnnounceResponse () {}
