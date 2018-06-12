  const mongoose = require('mongoose');

  const emailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    subject: { type: String, required: true },
    emailbody: { type: String, required: true}
  });

module.exports = mongoose.model('Email',emailSchema);


