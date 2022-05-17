module.exports = {
    AUTH_TOKEN_EXPIRY_HOURS: 168, // 7 days

    USER_PERMISSIONS: {
        Admin: 'Admin',
        Partner: 'Partner'
    },

    USER_STATUS: {
        BLOCKED: '-1',
        PENDING: '0',
        ACTIVE: '1',
        DELETED: '-2'
    },

    BIN_STATUS: {
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
        FULL: 'FULL'
    },

    TRANSACTION_STATUS: {
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED'
    },

    WASTE_TYPE: {
        WET: 'wet',
        DRY: 'dry'
    },

    COMPANY_ORDER_STATUS: {
        PENDING: 'PENDING',
        PAID: 'PAID'
    },
    COINS_HEIGHT_MULTIPLIER: 0.04,
    COINS_WEIGHT_MULTIPLIER: 0.07,
    TIMEOUT_PENALTY: -5
};
