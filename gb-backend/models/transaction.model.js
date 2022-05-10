const mongoose = require('mongoose');
const constants = require('../config/constants');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        binId: { type: Schema.Types.ObjectId, ref: 'Bin' },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        coins: { type: Number, default: 0 },
        wasteType: { type: String, default: constants.WASTE_TYPE.WET },
        height: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },
        // txnId: { type: String, default: null },
        status: {
            type: String,
            default: constants.TRANSACTION_STATUS.PENDING,
            enum: Object.values(constants.TRANSACTION_STATUS)
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('transaction', transactionSchema);
module.exports = Transaction;
