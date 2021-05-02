const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    senderid: { type: String },
    receiverid: { type: String },
    status: { type: Boolean },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Friend', schema);