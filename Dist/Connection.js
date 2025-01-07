"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize("db-classmatch", "stark", "EN46BOZa3b-.", {
    host: "db-classmatch.ct6wcoa8uyye.us-east-2.rds.amazonaws.com",
    dialect: "mysql",
});
exports.default = db;
