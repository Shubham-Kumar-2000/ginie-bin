const mongoose = require('mongoose');
const configConsts = require('../config/constants');
const addressSchema = require('./address.model');

const binSchema = new mongoose.Schema(
    {
        location: { type: addressSchema },
        status: {
            type: String,
            default: configConsts.BIN_STATUS.INACTIVE,
            enum: Object.values(configConsts.BIN_STATUS)
        },
        name: { type: String, default: null },
        filled: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        transactionId: { type: mongoose.Types.ObjectId, ref: 'transaction' }
    },
    { timestamps: true }
);

binSchema.statics.getBins = async (query) => {
    return await Bin.find(query).sort({ createdAt: -1 });
};

const Bin = mongoose.model('bin', binSchema);
module.exports = Bin;
