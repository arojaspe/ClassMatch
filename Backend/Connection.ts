import {Sequelize} from "sequelize";

const db= new Sequelize("classmatch", "Stark", "EN46BOZa3b-.", {
    host: "db-classmatch.ct6wcoa8uyye.us-east-2.rds.amazonaws.com",
    dialect: "mysql",
});
export default db;