const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Device = require('../models/device');

const gateway = new Schema({
    num_serie: {
        type: String,
        unique: true
    },
    nombre_gateway: String,
    ipv4: String,
    devices: [{
        type: Schema.Types.ObjectId,
        ref: 'Device'
    }],
});

gateway.pre('remove', function(next) {
    Device.deleteMany({
        _id: {
            $in: this.devices
        }
    }).exec();
    next();

});

module.exports = mongoose.model("Gateway", gateway);