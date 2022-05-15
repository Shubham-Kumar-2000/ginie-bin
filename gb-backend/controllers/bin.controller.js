// const { USER_ORDER_STATUS } = require('../config/constants');
// const NotFoundError = require('../errors/notFound.error');
// const { decrypt } = require('../helpers/crypto.helper');
// const Item = require('../models/items.model');
// const UserOrder = require('../models/user-orders.model');
const User = require('../models/user.model');
// const Fire = require('../helpers/5ire.helper');
const Bin = require('../models/bin.model');
const constants = require('../config/constants');
const Transaction = require('../models/transaction.model');
const { sign } = require('../helpers/bin.jwt.helper');

exports.createBin = async (req, res, next) => {
    try {
        const bin = new Bin(req.body);
        await bin.save();
        const token = sign({
            _id: bin._id,
            name: bin.name
        });
        res.status(201).json({ bin, token });
    } catch (e) {
        next(e);
    }
};

exports.allBins = async (req, res, next) => {
    try {
        const filter = { ...req.query };
        if (req.query.lat && req.query.lng) {
            delete filter.lat;
            delete filter.lng;
            filter['location.geoLocation'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [req.query.lng, req.query.lat]
                    },
                    $maxDistance: 5000
                }
            };
        }
        const bins = await Bin.find(filter).sort({
            createdAt: -1
        });

        res.status(200).json({
            bins
        });
    } catch (e) {
        next(e);
    }
};

exports.handleSuccessfullTransaction = async (
    socket,
    io,
    height,
    weight,
    timeout
) => {
    const oldBin = await Bin.findOne({ _id: socket.bin._id });
    let coins =
        constants.COINS_HEIGHT_MULTIPLIER * height +
        weight * constants.COINS_WEIGHT_MULTIPLIER;

    if (coins > 0 && timeout) {
        coins = 0;
    }

    if (timeout) {
        coins += constants.TIMEOUT_PENALTY;
    }
    const bin = await Bin.findOneAndUpdate(
        { _id: socket.bin._id },
        {
            $inc: { filled: height },
            $unset: { transactionId: '' },
            $set:
                oldBin.filled + height > oldBin.height
                    ? { status: constants.BIN_STATUS.FULL }
                    : { status: constants.BIN_STATUS.ACTIVE }
        }
    ).populate('transactionId');

    if (!bin || !bin.transactionId) {
        return;
    }

    await Promise.all([
        User.findOneAndUpdate(
            { _id: bin.transactionId.userId },
            { $inc: { ourCoins: coins } }
        ),
        Transaction.findOneAndUpdate(
            { _id: bin.transactionId._id },
            { $set: { status: constants.TRANSACTION_STATUS.COMPLETED, coins } }
        )
    ]);
    io.of('/user')
        .to(String(bin.transactionId.userId))
        .emit('transactionCompleted', coins);
};

exports.handleBinSocket = async (socket, io) => {
    try {
        await Bin.findOneAndUpdate(
            { _id: String(socket.bin._id) },
            {
                $set: {
                    height: socket.handshake?.query?.height,
                    status: constants.BIN_STATUS.ACTIVE,
                    wet: 0,
                    dry: 0
                },
                $unset: { transactionId: '' }
            },
            { new: true }
        );
        socket.join(String(socket.bin._id));
        socket.on('transaction', async ({ height, weight, timeout }) => {
            return exports.handleSuccessfullTransaction(
                socket,
                io,
                height,
                weight,
                timeout
            );
        });
    } catch (e) {
        socket.disconnect();
    }
    socket.on('disconnect', async () => {
        try {
            await Bin.findOneAndUpdate(
                { _id: String(socket.bin._id) },
                {
                    $set: { status: constants.BIN_STATUS.INACTIVE }
                }
            );
        } catch (e) {
            console.log(e);
        }
    });
};
