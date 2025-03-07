
import { Server, Socket } from "socket.io";
import * as Funcs from "./Functions";

export const socketHandler = (io: Server) => {
    const onlineUsers: { [userId: string]: { socketId: string; rooms: string[] } } = {};

    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Register
        socket.on("register", async ({ current_user }) => {
            try {
                onlineUsers[current_user] = { socketId: socket.id, rooms: [] }; // Initialize rooms array
                console.log(`User: ${current_user} is online with socket ID: ${socket.id}`);
                const userRooms = await Funcs.checkMyChats(current_user);
                socket.emit("my_chats", userRooms);
            } catch (error: any) {
                socket.emit("error_code", error.message);
            }
        });

        // Send
        // Modify the 'send' handler to notify participants
socket.on("send", async ({ current_user, room, message }) => {
    try {
        let newMessage = await Funcs.sendMessage(current_user, room.toString(), message);
        socket.broadcast.to(room).emit("receive", newMessage);

        // Get room participants (implement this in your Funcs)
        const participants = await Funcs.allUsersinRoomExcept(room.toString(), current_user);
        
        participants.forEach(participantId => {
            if (participantId !== current_user && onlineUsers[participantId]) {
                // Check if participant is not in the room
                if (!onlineUsers[participantId].rooms.includes(room.toString())) {
                    io.to(onlineUsers[participantId].socketId).emit("new_message_notification", {
                        roomId: room.toString()
                    });
                }
            }
        });
    } catch (error: any) {
        socket.emit("error_code", error.message);
    }
});

        // Get
        socket.on("get", async ({ current_user, room, page }) => {
            try {
                // Unjoin previous rooms
                if (onlineUsers[current_user] && onlineUsers[current_user].rooms) {
                    onlineUsers[current_user].rooms.forEach((prevRoom) => {
                        socket.leave(prevRoom);
                    });
                    onlineUsers[current_user].rooms = []; // Clear the rooms array
                }

                socket.join(room);
                if (onlineUsers[current_user]) {
                    onlineUsers[current_user].rooms.push(room); // Add the new room
                }

                const messages = await Funcs.getRoomMessages(current_user, room.toString(), page);
                socket.emit("room_messages", messages);
            } catch (error: any) {
                socket.emit("error_code", error.message);
            }
        });

        // Disconnect
        socket.on("disconnect", () => {
            for (const userId in onlineUsers) {
                if (onlineUsers[userId].socketId === socket.id) {
                    console.log(`User ${userId} disconnected`);
                    delete onlineUsers[userId];
                    break;
                }
            }
        });
    });
};