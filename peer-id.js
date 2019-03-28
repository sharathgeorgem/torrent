'use strict'

const crypto = require('crypto')

let id = null

module.exports.generateId = () => {
  if (!id) {
    id = crypto.randomBytes(20)
    Buffer.from('-EA9310-').copy(id, 0)
  }
  return id
}
