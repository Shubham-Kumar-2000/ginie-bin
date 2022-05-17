const NotFoundError = require('../errors/notFound.error');
const User = require('../models/user.model');
const Fire = require('../helpers/5ire.helper');
const { encrypt, decrypt } = require('../helpers/crypto.helper');
const Bin = require('../models/bin.model');
const constants = require('../config/constants');
const { getDistance } = require('geolib');
const Transaction = require('../models/transaction.model');
const { TIMEOUT_PENALTY } = require('../config/constants');

exports.profile = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        res.status(200).json({
            err: false,
            user
        });
    } catch (e) {
        next(e);
    }
};

exports.connectWallet = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        let phrase = req.body.phrase;
        if (!phrase) {
            phrase = await Fire.createAccount(`${user.name}'s wallet`);
        }

        const userRing = await Fire.getKeyRing(phrase);

        user.wallet = {
            publicKey: encrypt(JSON.stringify(Array.from(userRing.publicKey))),
            address: encrypt(userRing.address),
            name: userRing.meta.name
        };

        // await Fire.transfer(userRing.address, user.pendingCoins);
        // user.pendingCoins = 0;

        await user.save();

        res.status(200).json({
            error: false,
            user,
            phrase
        });
    } catch (e) {
        next(e);
    }
};

exports.disconnectWallet = async (req, res, next) => {
    try {
        const user = await User.disconnectWallet(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            error: false,
            user
        });
    } catch (e) {
        next(e);
    }
};

exports.getBalance = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (!user.wallet) {
            throw new Error('Wallet not connected');
        }
        const wallet = await Fire.getBalance(
            Uint8Array.from(JSON.parse(decrypt(user.wallet.publicKey)))
        );

        res.status(200).json({
            wallet,
            coins: user.ourCoins
        });
    } catch (e) {
        next(e);
    }
};

exports.mytransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            transactions
        });
    } catch (e) {
        next(e);
    }
};

exports.transferToWallet = async (req, res, next) => {
    try {
        const user = await User.getUser(req.user._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (!user.wallet) {
            throw new Error('Wallet not connected');
        }
        if (user.ourCoins + TIMEOUT_PENALTY <= 0) {
            throw new Error('You have insuffient coins to transfer');
        }

        const txHash = await Fire.transfer(
            decrypt(user.wallet.address),
            (user.ourCoins + TIMEOUT_PENALTY) * 1000000000000000000
        );
        await User.findOneAndUpdate(
            { _id: user._id },
            { $inc: { ourCoins: 0 - (user.ourCoins + TIMEOUT_PENALTY) } }
        );

        res.status(200).json({
            success: true,
            txHash
        });
    } catch (e) {
        next(e);
    }
};

exports.handleScoket = async (socket, io) => {
    let userBin = null;
    socket.join(String(socket.user._id));
    socket.on('dispose', async (data) => {
        const userLocation = data.location;
        const bin = await Bin.findOne({
            _id: data.binId
        });
        if (!bin) {
            return socket.emit('custom-error', "Bin doesn't exist");
        }
        if (bin.status === constants.BIN_STATUS.INACTIVE) {
            return socket.emit('custom-error', 'Bin is inactive');
        }
        if (bin.status === constants.BIN_STATUS.FULL) {
            return socket.emit('custom-error', 'Bin is full');
        }
        if (bin.transactionId) {
            return socket.emit('custom-error', 'Bin is busy');
        }
        console.log(
            {
                latitude: bin.location.geoLocation[1],
                longitude: bin.location.geoLocation[0]
            },
            { latitude: userLocation[1], longitude: userLocation[0] }
        );
        if (
            getDistance(
                {
                    latitude: bin.location.geoLocation.coordinates[1],
                    longitude: bin.location.geoLocation.coordinates[0]
                },
                { latitude: userLocation[1], longitude: userLocation[0] }
            ) > constants.MAX_BIN_DISTANCE
        ) {
            return socket.emit('custom-error', 'You are too far from the bin');
        }
        const transaction = new Transaction({
            binId: bin._id,
            userId: socket.user._id,
            wasteType: data.wasteType
        });
        await transaction.save();
        bin.transactionId = transaction._id;
        await bin.save();
        socket.emit('success', true);
        io.of('/bin').to(String(bin._id)).emit('open-bin', true);
        userBin = bin;
    });

    socket.on('dispose-done', () => {
        if (!userBin) {
            return socket.emit('custom-error', 'Not in transaction');
        }
        io.of('/bin').to(String(userBin._id)).emit('open-close', true);
        userBin = null;
    });
};
