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
      const announceRequest = buildAnnounceRequest(connectResponse.connectionId, torrent)
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
  crypto.randomBytes(4, (a, b) => { console.log('Written') }).copy(buffer, 12)
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
  16  */
  return {
    action: response.readUInt32BE(0),
    transactionId: response.readUInt32BE(4),
    connectionId: response.slice(8) // Unable to read as 64 bit Integer.
  }
}

function buildAnnounceRequest (connectionId, torrent, port = 6881) {
/*  Offset  Size    Name    Value
    0       64-bit integer  connection_id
    8       32-bit integer  action          1 // announce
    12      32-bit integer  transaction_id
    16      20-byte string  info_hash
    36      20-byte string  peer_id
    56      64-bit integer  downloaded
    64      64-bit integer  left
    72      64-bit integer  uploaded
    80      32-bit integer  event           0 // 0: none; 1: completed; 2: started; 3: stopped
    84      32-bit integer  IP address      0 // default
    88      32-bit integer  key             ? // random
    92      32-bit integer  num_want        -1 // default
    96      16-bit integer  port            ? // should be between
    98 */
  const buffer = Buffer.allocUnsafe(98)
  connectionId.copy(buffer, 0)
  buffer.writeUInt32BE(1, 8)
  crypto.randomBytes(4).copy(buffer, 12) 
}

function parseAnnounceResponse () {}
