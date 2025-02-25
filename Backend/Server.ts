import express, {Application} from "express";
import db from "./Connection";
import * as Rout from "./Routes";
import * as Funcs from "./Functions";
import { socketHandler } from "./Socket";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";  // Import HTTP module
import { Server as SocketIOServer } from "socket.io";


//import * as Test from "./test";

class Server {
    private app: Application;
    private port: String;
    private server: http.Server;
    private io: SocketIOServer;
    private apiPaths= {
        path: "/api/"
    }
    constructor(){
        this.dbConnect();
        this.app= express();
        this.port= "5000";
        this.middlewares();
        this.routes();
        this.server= http.createServer(this.app);
        this.io= new SocketIOServer(this.server, {
            cors: {
                credentials: true,
                origin: "*",
            },
            path: "/socket.io"
        });
        socketHandler(this.io);
    };

    middlewares () {
        this.app.use(cors({
                credentials: true,
                origin: "http://classmatch.site" // For deploy, use "*" for local
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
            console.log("Hello There")
            Funcs.findUsersByRating("4a24fb34-9abc-4f00-a378-f4323b916488", 9)
        } catch (error) {
            console.error("Error connecting to the database:", error);
        };
    };

    listen() {
        this.server.listen(this.port, () => {
            console.log("Server Running: " + this.port)
        });
    }
};

new Server().listen();
