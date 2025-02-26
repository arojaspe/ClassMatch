import express, { Application } from "express";
import db from "./Connection";
import * as Rout from "./Routes";
import * as Funcs from "./Functions";
import { socketHandler } from "./Socket";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally exit, so PM2 can restart the process:
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit, so PM2 can restart the process:
  process.exit(1);
});

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
                origin: "https://www.classmatch.site", // Use "*" for local
            },
            path: "/socket.io"
        });
        socketHandler(this.io);
    };

    middlewares () {
        this.app.use(cors({
                credentials: true,
                origin: "https://www.classmatch.site", // For deploy, use "*" for local
		        methods: 'GET,POST,PUT,DELETE,OPTIONS',
    		    allowedHeaders: 'Authorization,Content-Type'
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