import {Sequelize} from "sequelize";
import { Storage } from "@google-cloud/storage";
import { Resend } from 'resend';
import Multer from "multer";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPass = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST as string;


//AWS DB
const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: "mysql",
});
export default db;

//Images and GCP
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

//Resend emails
export const resend = new Resend(process.env.RESEND_API_KEY as string);