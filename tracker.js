'use strict'

const dgram = require('dgram')
const urlParse = require('url').parse()
const crypto = require('crypto') // Buffer encryption

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4')
  const url = torrent.announce.toString('utf-8')

  udpSend(socket, buildConnectRequest(), url)

  socket.on('message', response => {
    if (responseType(response) === 'connect') {
      const connectResponse = parseConnectResponse(response)
      const announceRequest = buildAnnounceRequest(connectResponse.connectionId)
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

function buildConnectRequest () {
  /* Connect Request format
    Offset  Size            Name            Value
    0       64-bit integer  connection_id   0x41727101980
    8       32-bit integer  action          0 // connect
    12      32-bit integer  transaction_id  ? // random
    16
  */
  const buffer = Buffer.alloc(16)
  // connection_id
  buffer.writeUInt32BE(0x417, 0)
  buffer.writeUInt32BE(0x27101980, 4)
  // action
  buffer.writeUInt32BE(0, 8)
  // transaction_id
  crypto.randomBytes(4).copy(buffer, 12)
}

function responseType (response) {
  const action = response.readUInt32BE(0)
  if (action === 0) return 'connect'
  if (action === 1) return 'announce'
}

function parseConnectResponse (response) {
  /* Connect Response format
  Offset  Size            Name            Value
  0       32-bit integer  action          1 // announce
  4       32-bit integer  transaction_id
  8       64-bit integer  connection_id
  16
  */
  return {
    action: response.readUInt32BE(0),
    transactionId: response.readUInt32BE(4),
    connectionId: response.slice(8) // Unable to read as 64 bit Integer.
  }
}

function buildAnnounceRequest () {}

function parseAnnounceResponse () {}
