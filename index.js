'use strict'

const fs = require('fs')
const bencode = require('bencode')

const dgram = require('dgram')
const { Buffer } = require('buffer')
const urlParse = require('url').parse

const torrent = bencode.decode(fs.readFileSync('beast.torrent'))

// Announce property on the buffer used to get the URL for the tracker.
const url = urlParse(torrent.announce.toString('utf-8'))

const socket = dgram.createSocket('udp4')

const myMsg = Buffer.from('hello?', 'utf-8')

socket.send(myMsg, 0, myMsg.length, url.port, url.host, () => {
  console.log('MESSAGE TRANSMITTED')
})

socket.on('message', msg => {
  console.log('The UDP msg received is ', msg)
})

console.log('The message is given as ', myMsg.toString('utf-8'))
console.log('Protocol`', url.protocol)
