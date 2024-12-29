import { DataTypes } from "sequelize";
import db from "./Connection";

//Tables
export const USERS_MOD= db.define("USER_MOD", {
    USER_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    USER_FIRSTNAME: {
        type: DataTypes.STRING,
    },
    USER_LASTNAME: {
        type: DataTypes.STRING,
    },
    USER_EMAIL: {
        type: DataTypes.STRING,
    },
    USER_PASSWORD: {
        type: DataTypes.STRING,
    },
    USER_COLLEGE_ID: {
        type: DataTypes.CHAR(36),
    },
    USER_GENDER: {
        type: DataTypes.ENUM("M", "F", "NB"),
    },
    USER_BIRTHDATE: {
        type: DataTypes.DATE,
    },
    USER_BIO: {
        type: DataTypes.TEXT,
    },
    USER_STATUS: {
        type: DataTypes.BOOLEAN,
    },
    USER_LAST_LOG: {
        type: DataTypes.TIME,
    },
    USER_RATING: {
        type: DataTypes.FLOAT,
    },
    USER_FILTER_AGE: {
        type: DataTypes.CHAR(5),
    },
    USER_SUPERMATCHES: {
        type: DataTypes.INTEGER,
    },
    USER_FILTER_GENDER: {
        type: DataTypes.ENUM("M", "F", "NB"),
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'USERS'
})
export const COLLEGES_MOD= db.define("COLLEGES_MOD", {
    COLLEGE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    COLLEGE_NAME: {
        type: DataTypes.STRING
    },
    COLLEGE_DOMAIN: {
        type: DataTypes.STRING
    }

}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'COLLEGES'
})
export const INTERESTS_MOD= db.define("INTERESTS_MOD", {
    INTEREST_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    INTEREST_NAME: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'INTERESTS'
})
export const USER_INTERESTS_MOD= db.define("USER_INTERESTS_MOD", {
    UINTEREST_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    UINTEREST_USER: {
        type: DataTypes.CHAR(36),
    },
    UINTEREST_INTEREST: {
        type: DataTypes.CHAR(36),
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'USER_INTERESTS'
})
export const CARDS_MOD= db.define("CARDS_MOD", {
    CARD_USER: {
        type: DataTypes.STRING(36),
        primaryKey: true
    },
    CARD_FIRSTN: {
        type: DataTypes.STRING,
    },
    CARD_LASTN: {
        type: DataTypes.STRING,
    },
    CARD_NUMBER: {
        type: DataTypes.CHAR(16),
    },
    CARD_EXPIRATION_M: {
        type: DataTypes.TINYINT,
    },
    CARD_EXPIRTATION_Y: {
        type: DataTypes.TINYINT,
    },
    CARD_CODE: {
        type: DataTypes.CHAR(4),
    },
    CARD_LAST_PAYMENT: {
        type: DataTypes.DATE,
    },
    CARD_STATUS: {
        type: DataTypes.BOOLEAN,
    },
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'CARDS'
})
export const EVENTS_MOD= db.define("EVENTS_MOD", {
    EVENT_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    EVENT_ADMIN: {
        type: DataTypes.CHAR(36),
    },
    EVENT_CAPACITY: {
        type: DataTypes.TINYINT,
    },
    EVENT_DATE: {
        type: DataTypes.DATE,
    },
    EVENT_DESCRIPTION: {
        type: DataTypes.TEXT,
    },
    EVENT_LOCK: {
        type: DataTypes.BOOLEAN,
    },
    EVENT_STATUS: {
        type: DataTypes.BOOLEAN,
    }
}, {
    createdAt: false,
    freezeTableName: true,
    tableName: 'EVENTS'
})
export const USER_IMAGES_MOD= db.define("USER_IMAGES_MOD", {
    IMAGE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_USER: {
        type: DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'EVENT_IMAGES'
})
export const EVENT_IMAGES_MOD= db.define("EVENT_IMAGES_MOD", {
    IMAGE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_EVENT: {
        type: DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'EVENT_IMAGES'
})
export const REPORT_IMAGES_MOD= db.define("REPORT_IMAGES_MOD", {
    IMAGE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_REPORT: {
        type: DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: DataTypes.TINYINT,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'REPORT_IMAGES'
})
export const USER_EVENTS_MOD= db.define("USER_EVENTS_MOD", {
    UEVENTS_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    UEVENTS_EVENT: {
        type: DataTypes.CHAR(36),
    },
    UEVENTS_ATTENDEE: {
        type: DataTypes.CHAR(36),
    },
    UEVENTS_ACCEPTED: {
        type: DataTypes.BOOLEAN,
    }
}, {
    freezeTableName: true,
    tableName: 'USER_EVENTS'
})
export const CHATS_USERS_MOD= db.define("CHATS_USERS_MOD", {
    CHAT_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    CHAT_SENDER: {
        type: DataTypes.CHAR(36),
    },
    CHAT_RECEIVER: {
        type: DataTypes.CHAR(36),
    },
    CHAT_MESSAGE: {
        type: DataTypes.TEXT,
    },
    CHAT_READ: {
        type: DataTypes.BOOLEAN,
    },
    CHAT_TIMETAMP: {
        type: DataTypes.NOW,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'CHATS_USERS'
})
export const CHATS_EVENTS_MOD= db.define("CHATS_EVENTS_MOD", {
    CHAT_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    CHAT_SENDER: {
        type: DataTypes.CHAR(36),
    },
    CHAT_EVENT: {
        type: DataTypes.CHAR(36),
    },
    CHAT_MESSAGE: {
        type: DataTypes.TEXT,
    },
    CHAT_TIMETAMP: {
        type: DataTypes.NOW,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'CHATS_EVENTS'
})
export const MATCHES_MOD= db.define("MATCHES_MOD", {
    MATCH_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    MATCHING_USER: {
        type: DataTypes.CHAR(36),
    },
    MATCHED_USER: {
        type: DataTypes.CHAR(36),
    },
    SUPERMATCH: {
        type: DataTypes.BOOLEAN,
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'MATCHES'
})
export const REPORT_MOD= db.define("REPORT_MOD", {
    REPORT_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    REPORTING_USER: {
        type: DataTypes.CHAR(36),
    },
    REPORTED_USER: {
        type: DataTypes.CHAR(36),
    },
    REPORT_REASON: {
        type: DataTypes.BOOLEAN,
    }
}, {
    updatedAt: false,
    freezeTableName: true,
    tableName: 'REPORT'
})


//Relations


//user-college
COLLEGES_MOD.hasMany(USERS_MOD, {
    foreignKey: 'COLLEGE_ID',
});
USERS_MOD.belongsTo(COLLEGES_MOD);

//interest-user_interest
INTERESTS_MOD.hasMany(USER_INTERESTS_MOD, {
    foreignKey: 'UINTEREST_INTEREST',
});
USER_INTERESTS_MOD.belongsTo(INTERESTS_MOD);

//user-user_interest
USERS_MOD.hasMany(USER_INTERESTS_MOD, {
    foreignKey: 'UINTEREST_USER',
});
USERS_MOD.belongsTo(INTERESTS_MOD);