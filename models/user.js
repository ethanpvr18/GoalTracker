let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  goals:{
    type: Array,
    required: false
  }
});

const User = module.exports = mongoose.model('User', UserSchema);