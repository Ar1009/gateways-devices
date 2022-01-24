const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const device = new Schema({
    uid: {
        type: Number,
        unique: true
    },
    vendor: String,
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    gateway: [{
        type: Schema.Types.ObjectId,
        ref: 'Gateway'
    }],
});
module.exports = mongoose.model('Device', device);