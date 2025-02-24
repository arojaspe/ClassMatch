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
    timestamps: false,
    freezeTableName: true,
    tableName: 'USERS'
})
export const SCHEDULES_MOD= db.define("SCHEDULES_MOD", {
    SCHEDULE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    USER_ID: {
        type: DataTypes.CHAR(36)
    },
    MONDAY: {
        type: DataTypes.INTEGER
    },
    TUESDAY: {
        type: DataTypes.INTEGER
    },
    WEDNESDAY: {
        type: DataTypes.INTEGER
    },
    THURSDAY: {
        type: DataTypes.INTEGER
    },
    FRIDAY: {
        type: DataTypes.INTEGER
    },
    SATURDAY: {
        type: DataTypes.INTEGER
    },
    SUNDAY: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'SCHEDULES'
})
export const SUBSCRIPTIONS_MOD= db.define("SUBSCRIPTIONS_MOD", {
    SUBSCRIPTION_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    SUBSCRIPTION_USER: {
        type: DataTypes.CHAR(36)
    },
    SUBSCRIPTION_API_ID: {
        type: DataTypes.CHAR(32)
    },
    SUBSCRIPTION_PLAN: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'SUBSCRIPTIONS'
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
    },
    COLLEGE_CITY: {
        type: DataTypes.STRING
    }    
}, {
    timestamps: false,
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
    timestamps: false,
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
    EVENT_TITLE: {
        type: DataTypes.STRING,
    },
    EVENT_LOCATION: {
        type: DataTypes.STRING,
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
    timestamps: false,
    freezeTableName: true,
    tableName: 'EVENTS'
})
export const IMAGES_MOD= db.define("IMAGES_MOD", {
    IMAGE_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    IMAGE_RELATION: {
        type: DataTypes.CHAR(36),
    },
    IMAGE_LINK: {
        type: DataTypes.TEXT,
    },
    IMAGE_ORDER: {
        type: DataTypes.TINYINT,
    },
    IMAGE_TYPE: {
        type: DataTypes.ENUM("USER", "EVENT", "REPORT"),
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'IMAGES'
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
    timestamps: false,
    freezeTableName: true,
    tableName: 'USER_EVENTS'
})
export const CHATS_MOD= db.define("CHATS_MOD", {
    CHAT_ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    CHAT_SENDER: {
        type: DataTypes.CHAR(36),
    },
    CHAT_ROOM: {
        type: DataTypes.CHAR(36),
    },
    CHAT_MESSAGE: {
        type: DataTypes.TEXT,
    },
    CHAT_TIMESTAMP: {
        type: DataTypes.NOW,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'CHATS'
})
export const READ_STATUS_MOD= db.define("READ_STATUS_MOD", {
    RS_CHAT: {
        type: DataTypes.CHAR(36)
    },
    RS_USER: {
        type: DataTypes.CHAR(36),
    },
    RS_TIMESTAMP: {
        type: DataTypes.NOW,
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'READ_STATUS'
})
export const ROOMS_MOD= db.define("ROOMS_MOD", {
    ID: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    },
    ROOM_USER: {
        type: DataTypes.CHAR(36),
    },
    ROOM_EVENT: {
        type: DataTypes.CHAR(36),
    },
    ROOM_ID: {
        type: DataTypes.CHAR(36)
    }
}, {
    
    timestamps: false,
    freezeTableName: true,
    tableName: 'ROOMS'
}
)
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
    timestamps: false,
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
    timestamps: false,
    freezeTableName: true,
    tableName: 'REPORTS'
})


//Relations

// User-Subscription
USERS_MOD.hasOne(SUBSCRIPTIONS_MOD, {foreignKey: 'SUBSCRIPTION_USER', as: 'USER_SUBSCRIPTION'});
SUBSCRIPTIONS_MOD.belongsTo(USERS_MOD, {foreignKey: 'SUBSCRIPTION_USER', as: 'USER_SUBSCRIPTION'});

// User-Schedule
USERS_MOD.hasOne(SCHEDULES_MOD, {foreignKey: 'USER_ID', as: 'USER_SCHEDULE'});
SCHEDULES_MOD.belongsTo(USERS_MOD, {foreignKey: 'USER_ID', as: 'USER_SCHEDULE'});

// User-College
COLLEGES_MOD.hasMany(USERS_MOD, {foreignKey: 'USER_COLLEGE_ID'});
USERS_MOD.belongsTo(COLLEGES_MOD, {foreignKey: 'USER_COLLEGE_ID'});

// Interest-User_Interest
INTERESTS_MOD.hasMany(USER_INTERESTS_MOD, {foreignKey: 'UINTEREST_INTEREST'});
USER_INTERESTS_MOD.belongsTo(INTERESTS_MOD, {foreignKey: 'UINTEREST_INTEREST'});

// User-User_Interest
USERS_MOD.hasMany(USER_INTERESTS_MOD, {foreignKey: 'UINTEREST_USER'});
USER_INTERESTS_MOD.belongsTo(USERS_MOD, {foreignKey: 'UINTEREST_USER'});

// User-Card
USERS_MOD.hasMany(CARDS_MOD, {foreignKey: 'CARD_USER'});
CARDS_MOD.belongsTo(USERS_MOD, {foreignKey: 'CARD_USER'});

// User-Event
USERS_MOD.hasMany(EVENTS_MOD, {foreignKey: 'EVENT_ADMIN'});
EVENTS_MOD.belongsTo(USERS_MOD, {foreignKey: 'EVENT_ADMIN'});

// User-User_Images
USERS_MOD.hasMany(IMAGES_MOD, {foreignKey: 'IMAGE_RELATION', as: 'USER_IMAGES'});
IMAGES_MOD.belongsTo(USERS_MOD, {foreignKey: 'IMAGE_RELATION', as: 'USER_IMAGES'});

// Event-Event_Images
EVENTS_MOD.hasMany(IMAGES_MOD, {foreignKey: 'IMAGE_RELATION', as: "EVENT_IMAGES"});
IMAGES_MOD.belongsTo(EVENTS_MOD, {foreignKey: 'IMAGE_RELATION', as: "EVENT_IMAGES"});

// Report-Report_Images
REPORT_MOD.hasMany(IMAGES_MOD, {foreignKey: 'IMAGE_RELATION', as: "REPORT_IMAGES"});
IMAGES_MOD.belongsTo(REPORT_MOD, {foreignKey: 'IMAGE_RELATION', as: "REPORT_IMAGES"});

// Event-User_Events
EVENTS_MOD.hasMany(USER_EVENTS_MOD, {foreignKey: 'UEVENTS_EVENT', as: "EVENTS"});
USER_EVENTS_MOD.belongsTo(EVENTS_MOD, {foreignKey: 'UEVENTS_EVENT', as: "EVENTS"});

// User-User_Events
USERS_MOD.hasMany(USER_EVENTS_MOD, {foreignKey: 'UEVENTS_ATTENDEE'});
USER_EVENTS_MOD.belongsTo(USERS_MOD, {foreignKey: 'UEVENTS_ATTENDEE'});

// User-Chats
USERS_MOD.hasMany(CHATS_MOD, {foreignKey: 'CHAT_SENDER'});
CHATS_MOD.belongsTo(USERS_MOD, {foreignKey: 'CHAT_SENDER'});

// User-Rooms
USERS_MOD.hasMany(ROOMS_MOD, {foreignKey: 'ROOM_USER'});
ROOMS_MOD.belongsTo(USERS_MOD, {foreignKey: 'ROOM_USER'});

// Event-Rooms
EVENTS_MOD.hasMany(ROOMS_MOD, {foreignKey: 'ROOM_EVENT', as: "EVENT_ROOM"});
ROOMS_MOD.belongsTo(EVENTS_MOD, {foreignKey: 'ROOM_EVENT', as: "EVENT_ROOM"});

// User-Read_Status
USERS_MOD.hasMany(READ_STATUS_MOD, {foreignKey: 'RS_USER'});
READ_STATUS_MOD.belongsTo(USERS_MOD, {foreignKey: 'RS_USER'});

// Chats-Read_Status
CHATS_MOD.hasMany(READ_STATUS_MOD, { foreignKey: "RS_CHAT", as: "READ_STATUS" });
READ_STATUS_MOD.belongsTo(CHATS_MOD, { foreignKey: "RS_CHAT", as: "chat" });

// User-Matches
USERS_MOD.hasMany(MATCHES_MOD, {foreignKey: 'MATCHING_USER'});
MATCHES_MOD.belongsTo(USERS_MOD, {foreignKey: 'MATCHING_USER'});
USERS_MOD.hasMany(MATCHES_MOD, {foreignKey: 'MATCHED_USER'});
MATCHES_MOD.belongsTo(USERS_MOD, {foreignKey: 'MATCHED_USER'});

// User-Report
USERS_MOD.hasMany(REPORT_MOD, {foreignKey: 'REPORTING_USER'});
REPORT_MOD.belongsTo(USERS_MOD, {foreignKey: 'REPORTING_USER'});
USERS_MOD.hasMany(REPORT_MOD, {foreignKey: 'REPORTED_USER'});
REPORT_MOD.belongsTo(USERS_MOD, {foreignKey: 'REPORTED_USER'});
