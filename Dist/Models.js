"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_MOD = exports.MATCHES_MOD = exports.CHATS_EVENTS_MOD = exports.CHATS_USERS_MOD = exports.USER_EVENTS_MOD = exports.REPORT_IMAGES_MOD = exports.EVENT_IMAGES_MOD = exports.USER_IMAGES_MOD = exports.EVENTS_MOD = exports.CARDS_MOD = exports.USER_INTERESTS_MOD = exports.INTERESTS_MOD = exports.COLLEGES_MOD = exports.USERS_MOD = void 0;
const sequelize_1 = require("sequelize");
const Connection_1 = __importDefault(require("./Connection"));
//Tables
exports.USERS_MOD = Connection_1.default.define("USER_MOD", {
    USER_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    USER_FIRSTNAME: {
        type: sequelize_1.DataTypes.STRING,
    },
    USER_LASTNAME: {
        type: sequelize_1.DataTypes.STRING,
    },
    USER_EMAIL: {
        type: sequelize_1.DataTypes.STRING,
    },
    USER_PASSWORD: {
        type: sequelize_1.DataTypes.STRING,
    },
    USER_COLLEGE_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    USER_GENDER: {
        type: sequelize_1.DataTypes.ENUM("M", "F", "NB"),
    },
    USER_BIRTHDATE: {
        type: sequelize_1.DataTypes.DATE,
    },
    USER_BIO: {
        type: sequelize_1.DataTypes.TEXT,
    },
    USER_STATUS: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    USER_LAST_LOG: {
        type: sequelize_1.DataTypes.TIME,
    },
    USER_RATING: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    USER_FILTER_AGE: {
        type: sequelize_1.DataTypes.CHAR(5),
    },
    USER_SUPERMATCHES: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    USER_FILTER_GENDER: {
        type: sequelize_1.DataTypes.ENUM("M", "F", "NB"),
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'USERS'
});
exports.COLLEGES_MOD = Connection_1.default.define("COLLEGES_MOD", {
    COLLEGE_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true,
    },
    COLLEGE_NAME: {
        type: sequelize_1.DataTypes.STRING
    },
    COLLEGE_DOMAIN: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'COLLEGES'
});
exports.INTERESTS_MOD = Connection_1.default.define("INTERESTS_MOD", {
    INTEREST_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    INTEREST_NAME: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'INTERESTS'
});
exports.USER_INTERESTS_MOD = Connection_1.default.define("USER_INTERESTS_MOD", {
    UINTEREST_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    UINTEREST_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    UINTEREST_INTEREST: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'USER_INTERESTS'
});
exports.CARDS_MOD = Connection_1.default.define("CARDS_MOD", {
    CARD_USER: {
        type: sequelize_1.DataTypes.STRING(36),
        primaryKey: true
    },
    CARD_FIRSTN: {
        type: sequelize_1.DataTypes.STRING,
    },
    CARD_LASTN: {
        type: sequelize_1.DataTypes.STRING,
    },
    CARD_NUMBER: {
        type: sequelize_1.DataTypes.CHAR(16),
    },
    CARD_EXPIRATION_M: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    CARD_EXPIRTATION_Y: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    CARD_CODE: {
        type: sequelize_1.DataTypes.CHAR(4),
    },
    CARD_LAST_PAYMENT: {
        type: sequelize_1.DataTypes.DATE,
    },
    CARD_STATUS: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'CARDS'
});
exports.EVENTS_MOD = Connection_1.default.define("EVENTS_MOD", {
    EVENT_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    EVENT_ADMIN: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    EVENT_CAPACITY: {
        type: sequelize_1.DataTypes.TINYINT,
    },
    EVENT_DATE: {
        type: sequelize_1.DataTypes.DATE,
    },
    EVENT_DESCRIPTION: {
        type: sequelize_1.DataTypes.TEXT,
    },
    EVENT_LOCK: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    EVENT_STATUS: {
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    createdAt: false,
    freezeTableName: true,
    tableName: 'EVENTS'
});
exports.USER_IMAGES_MOD = Connection_1.default.define("USER_IMAGES_MOD", {
    IMAGE_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: sequelize_1.DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'EVENT_IMAGES'
});
exports.EVENT_IMAGES_MOD = Connection_1.default.define("EVENT_IMAGES_MOD", {
    IMAGE_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_EVENT: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: sequelize_1.DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'EVENT_IMAGES'
});
exports.REPORT_IMAGES_MOD = Connection_1.default.define("REPORT_IMAGES_MOD", {
    IMAGE_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_REPORT: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: sequelize_1.DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'REPORT_IMAGES'
});
exports.USER_EVENTS_MOD = Connection_1.default.define("USER_EVENTS_MOD", {
    UEVENTS_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    UEVENTS_EVENT: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    UEVENTS_ATTENDEE: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    UEVENTS_ACCEPTED: {
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    freezeTableName: true,
    tableName: 'USER_EVENTS'
});
exports.CHATS_USERS_MOD = Connection_1.default.define("CHATS_USERS_MOD", {
    CHAT_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    CHAT_SENDER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    CHAT_RECEIVER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    CHAT_MESSAGE: {
        type: sequelize_1.DataTypes.TEXT,
    },
    CHAT_READ: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    CHAT_TIMETAMP: {
        type: sequelize_1.DataTypes.NOW,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'CHATS_USERS'
});
exports.CHATS_EVENTS_MOD = Connection_1.default.define("CHATS_EVENTS_MOD", {
    CHAT_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    CHAT_SENDER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    CHAT_EVENT: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    CHAT_MESSAGE: {
        type: sequelize_1.DataTypes.TEXT,
    },
    CHAT_TIMETAMP: {
        type: sequelize_1.DataTypes.NOW,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'CHATS_EVENTS'
});
exports.MATCHES_MOD = Connection_1.default.define("MATCHES_MOD", {
    MATCH_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    MATCHING_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    MATCHED_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    SUPERMATCH: {
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'MATCHES'
});
exports.REPORT_MOD = Connection_1.default.define("REPORT_MOD", {
    REPORT_ID: {
        type: sequelize_1.DataTypes.CHAR(36),
        primaryKey: true
    },
    REPORTING_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    REPORTED_USER: {
        type: sequelize_1.DataTypes.CHAR(36),
    },
    REPORT_REASON: {
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'REPORT'
});
//Relations
//User-College
exports.COLLEGES_MOD.hasMany(exports.USERS_MOD, {
    foreignKey: 'USER_COLLEGE_ID',
});
exports.USERS_MOD.belongsTo(exports.COLLEGES_MOD);
// Interest-User_Interest 
exports.INTERESTS_MOD.hasMany(exports.USER_INTERESTS_MOD, {
    foreignKey: 'UINTEREST_INTEREST',
});
exports.USER_INTERESTS_MOD.belongsTo(exports.INTERESTS_MOD);
// User-User_Interest 
exports.USERS_MOD.hasMany(exports.USER_INTERESTS_MOD, {
    foreignKey: 'UINTEREST_USER',
});
exports.USER_INTERESTS_MOD.belongsTo(exports.USERS_MOD);
// User-Card 
exports.USERS_MOD.hasMany(exports.CARDS_MOD, {
    foreignKey: 'CARD_USER',
});
exports.CARDS_MOD.belongsTo(exports.USERS_MOD);
// User-Event 
exports.USERS_MOD.hasMany(exports.EVENTS_MOD, {
    foreignKey: 'EVENT_ADMIN',
});
exports.EVENTS_MOD.belongsTo(exports.USERS_MOD);
// User-User_Images 
exports.USERS_MOD.hasMany(exports.USER_IMAGES_MOD, {
    foreignKey: 'IMAGE_USER',
});
exports.USER_IMAGES_MOD.belongsTo(exports.USERS_MOD);
// Event-Event_Images 
exports.EVENTS_MOD.hasMany(exports.EVENT_IMAGES_MOD, {
    foreignKey: 'IMAGE_EVENT',
});
exports.EVENT_IMAGES_MOD.belongsTo(exports.EVENTS_MOD);
// Report-Report_Images 
exports.REPORT_MOD.hasMany(exports.REPORT_IMAGES_MOD, {
    foreignKey: 'IMAGE_REPORT',
});
exports.REPORT_IMAGES_MOD.belongsTo(exports.REPORT_MOD);
// Event-User_Events 
exports.EVENTS_MOD.hasMany(exports.USER_EVENTS_MOD, {
    foreignKey: 'UEVENTS_EVENT',
});
exports.USER_EVENTS_MOD.belongsTo(exports.EVENTS_MOD);
// User-User_Events 
exports.USERS_MOD.hasMany(exports.USER_EVENTS_MOD, {
    foreignKey: 'UEVENTS_ATTENDEE',
});
exports.USER_EVENTS_MOD.belongsTo(exports.USERS_MOD);
// User-Chats_Users 
exports.USERS_MOD.hasMany(exports.CHATS_USERS_MOD, {
    foreignKey: 'CHAT_SENDER',
});
exports.CHATS_USERS_MOD.belongsTo(exports.USERS_MOD);
exports.USERS_MOD.hasMany(exports.CHATS_USERS_MOD, {
    foreignKey: 'CHAT_RECEIVER',
});
exports.CHATS_USERS_MOD.belongsTo(exports.USERS_MOD);
// Event-Chats_Events 
exports.EVENTS_MOD.hasMany(exports.CHATS_EVENTS_MOD, {
    foreignKey: 'CHAT_EVENT',
});
exports.CHATS_EVENTS_MOD.belongsTo(exports.EVENTS_MOD);
// User-Chats_Events 
exports.USERS_MOD.hasMany(exports.CHATS_EVENTS_MOD, {
    foreignKey: 'CHAT_SENDER',
});
exports.CHATS_EVENTS_MOD.belongsTo(exports.USERS_MOD);
// User-Matches 
exports.USERS_MOD.hasMany(exports.MATCHES_MOD, {
    foreignKey: 'MATCHING_USER',
});
exports.MATCHES_MOD.belongsTo(exports.USERS_MOD);
exports.USERS_MOD.hasMany(exports.MATCHES_MOD, {
    foreignKey: 'MATCHED_USER',
});
exports.MATCHES_MOD.belongsTo(exports.USERS_MOD);
// User-Report 
exports.USERS_MOD.hasMany(exports.REPORT_MOD, {
    foreignKey: 'REPORTING_USER',
});
exports.REPORT_MOD.belongsTo(exports.USERS_MOD);
exports.USERS_MOD.hasMany(exports.REPORT_MOD, {
    foreignKey: 'REPORTED_USER',
});
exports.REPORT_MOD.belongsTo(exports.USERS_MOD);
