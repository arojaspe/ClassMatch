
import { Server, Socket } from "socket.io";
import * as Funcs from "./Functions";

export const socketHandler = (io: Server) => {
    const onlineUsers: { [userId: string]: string } = {};

    io.of("/socket.io").on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Register
        socket.on("register", async ({current_user}) => {
            try {
                onlineUsers[current_user] = socket.id;
                console.log(`User: ${current_user} is online with socket ID: ${socket.id}`);
                const userRooms = await Funcs.checkMyChats(current_user);

                userRooms.users.forEach((room) => {
                    console.log("U Room: "+room.ROOM_ID)
                    socket.join(room.ROOM_ID);
                });

                userRooms.events.forEach((room) => {
                    console.log("E Room: "+room.ROOM_ID)
                    socket.join(room.ROOM_ID);
                });
                
                socket.emit("my_chats", userRooms);
            } catch (error: any) {
                socket.emit("error_code", error.message);
            }
        });

        // Send
        socket.on("send", async ({ current_user, room, message }) => {
            try {
                let newMessage = await Funcs.sendMessage(current_user, room.toString(), message);
                socket.to(room).emit("receive", newMessage);
            } catch (error: any) {
                console.log(error)
                socket.emit("error_code", error.message);
            }
        });

        // Get
        socket.on("get", async ({ current_user, room, page}) => {
            try {
                const messages = await Funcs.getRoomMessages(current_user, room.toString(), page.toString());
                socket.emit("room_messages", messages);
            } catch (error: any) {
                socket.emit("error_code", error.message);
            }
        });

        // Disconnect
        socket.on("disconnect", () => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    console.log(`User ${userId} disconnected`);
                    delete onlineUsers[userId];
                    break;
                }
            }
        });
    });
}