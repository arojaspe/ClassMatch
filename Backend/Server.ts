import express, {Application} from "express";
import db from "./Connection";
import * as Rout from "./Routes";
import cors from "cors";
import cookieParser from "cookie-parser";

import * as Test from "./test";

class Server {
    private app: Application;
    private port: String;
    private apiPaths= {
        path: "/api/"
    }
    constructor(){
        this.dbConnect();
        this.app= express();
        this.port= "5000";
        this.middlewares();
        this.routes()
    };

    middlewares () {
        this.app.use(cors({
                credentials: true,
                origin: "*"
            }
        ));
        this.app.use(cookieParser())
        this.app.use(express.json());
        this.app.use(express.static("Public"));
    }
    routes () {
        this.app.use(this.apiPaths.path, Rout.default)
    }

    async dbConnect() {
        try {
            await db.authenticate();
            console.log("Database Online");

            //Run code here to test
            console.log("Hello There")
            //Func.createUser("John Spartan", "Test", "john@unal.edu.co", "password", "M", new Date("2000-10-03"), "f639a03f-2496-4b7d-8665-d2c748cd837f", "Bio", "18-25", "F")
        } catch (error) {
            console.error("Error connecting to the database:", error);
        };
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server Running: " + this.port)
        })
    }
};

new Server().listen();
Test.test();
