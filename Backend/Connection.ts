import {Sequelize} from "sequelize";
import { Storage } from "@google-cloud/storage";
import Multer from "multer";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPass = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;

const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: "mysql",
});
export default db;

const storage = new Storage({
    keyFilename: "GCP_Secret.json",
});
export const bucket = storage.bucket("classmatch");

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 2000 * 2000
    },
});