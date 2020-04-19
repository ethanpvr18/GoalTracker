let mongoose = require('mongoose');

let goalSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  start:{
    type: String,
    required: true
  },
  goalAmount:{
    type: Number,
    required: true
  },
  units:{
    type: String,
    required: true
  },
  currentProgress:{
    type: Number,
    required: true
  },
  goalLog:{
    type: Array,
    required: false
  }
});

let Goal = module.exports = mongoose.model('Goal', goalSchema);