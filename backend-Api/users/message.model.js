const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    to: { type: Number },
    message:{
        type:{ type: String},
        text: { type: String},
        date: { type: Number},
        className: {type: String}
    },
    from: { type: Number },
    seen: { type: Boolean },
    date: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Message', schema);