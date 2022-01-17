const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  uu_id: {
    type: String
  },
  email: {
    type: String
  },
  mailcode: {
    type: Number
  },
  verify: {
    type: Boolean
  },
  ipaddress: {
    type: String
  }
}, {
  collection: 'users'
})

module.exports = mongoose.model('User', userSchema)