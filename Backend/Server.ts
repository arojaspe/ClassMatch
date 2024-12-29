import express, {Application} from "express";
import db from "./Connection";
import * as Rout from "./Routes";
import cors from "cors";
import cookieParser from "cookie-parser";
//import * as Funcs from "./Functions/Funcs"

class Server {
    private app: Application;
    private port: String;
    private apiPaths= {
        path: "/api/"
    }
    constructor(){
        this.dbConnect();
        this.app= express();
        this.port= process.env.PORT || "5000";
        this.middlewares();
        this.routes();
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