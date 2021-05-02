const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: Number },
    email: { type: String },
    phone: { type: Number },
    about: { type: String },
    image: { type: String, default: null },
    username: { type: String, unique: true },
    hash: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);