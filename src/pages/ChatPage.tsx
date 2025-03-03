import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  CHAT_ID: string;
  CHAT_SENDER: string;
  CHAT_MESSAGE: string;
  CHAT_TIMESTAMP: string;
  READ_STATUS?: { RS_USER: string; RS_TIMESTAMP: string }[];
}

interface Room {
  ROOM_ID: string;
  USER_FIRSTNAME: string;
  USER_IMAGES: string;
}

interface Event {
  ROOM_ID: string;
  EVENT_TITLE: string;
  EVENT_IMAGES: string;
}

const socketUrl = "https://www.classmatch.site";

const ChatPage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>(
    {}
  );
  const [messageText, setMessageText] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [personaChat, setPersonaChat] = useState<string>("");
  const [linkImagen, setLinkImagen] = useState<string>("");
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = currentUser ? currentUser.USER_ID : null;

  onlineUsers.push(userId);

  // Conexión al socket: se ejecuta una sola vez cuando se tiene userId
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Conectado con socket id:", newSocket.id);
      newSocket.emit("register", { current_user: userId });
    });

    newSocket.on("my_chats", (data: { users: Room[]; events: Event[] }) => {
      console.log("my_chats event received");
      console.log("Rooms recibidos:", data.users);
      setRooms(data.users);
      // Si aún no se ha seleccionado un room, selecciona el primero
      if (data.users.length > 0 && !currentRoom) {
        const defaultRoom = data.users[0];
        setCurrentRoom(defaultRoom.ROOM_ID);
        setPersonaChat(defaultRoom.USER_FIRSTNAME);
        setLinkImagen(defaultRoom.USER_IMAGES);
      }
    });

    newSocket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });

    newSocket.on("receive", (newMessage: ChatMessage) => {
      if (!currentRoom) return;
      setMessages((prev) => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), newMessage],
      }));
    });

    newSocket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, currentRoom]);

  // Cargar mensajes al cambiar de sala
  useEffect(() => {
    if (socket && currentRoom) {
      socket.emit("get", { current_user: userId, room: currentRoom, page: 1 });
      const roomMessagesHandler = (msgs: ChatMessage[]) => {
        setMessages((prev) => ({ ...prev, [currentRoom]: msgs }));
      };
      socket.on("room_messages", roomMessagesHandler);
      return () => {
        socket.off("room_messages", roomMessagesHandler);
      };
    }
  }, [currentRoom, socket, userId]);

  const handleSendMessage = () => {
    if (socket && currentRoom && messageText.trim()) {
      socket.emit("send", {
        current_user: userId,
        room: currentRoom,
        message: messageText,
      });
      // Agregar el mensaje localmente para feedback inmediato
      setMessages((prev) => ({
        ...prev,
        [currentRoom]: [
          ...(prev[currentRoom] || []),
          {
            CHAT_ID: currentRoom,
            CHAT_SENDER: "Tú",
            CHAT_MESSAGE: messageText,
            CHAT_TIMESTAMP: new Date().toISOString(),
            READ_STATUS: [],
          },
        ],
      }));
      setMessageText("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-backgroundClassMatch ">
      <div className="flex my-[12vh] mx-auto w-full max-w-5xl h-[75vh] font-KhandRegular bg-mainClassMatch rounded-xl shadow-lg overflow-hidden">
        {/* Sidebar de rooms */}
        <div className="w-1/4 bg-accentClassMatch p-6 border-r">
          <h2 className="text-xl font-semibold text-gray-800 mb-6"></h2>
          <div className="space-y-3">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div
                  key={room.ROOM_ID}
                  className={`p-3 rounded-lg cursor-pointer transition duration-300 flex items-center justify-between ${
                    currentRoom === room.ROOM_ID
                      ? "bg-mainClassMatch text-white text-lg font-KhandSemiBold shadow-md"
                      : "bg-white text-lg font-KhandSemiBold hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentRoom(room.ROOM_ID);
                    setPersonaChat(room.USER_FIRSTNAME);
                    setLinkImagen(room.USER_IMAGES);
                  }}
                >
                  <span>{room.USER_FIRSTNAME}</span>
                  <img
                    className="h-16 w-16 object-cover border-white border-2 rounded-full"
                    src={room.USER_IMAGES}
                    alt="imagen perfil"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No hay chats disponibles
              </p>
            )}
          </div>
        </div>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {currentRoom ? (
            <>
              <div className="p-5 border-b flex items-center justify-between bg-headClassMatch shadow-sm">
                <h1 className="text-xl font-semibold text-gray-100">
                  {personaChat}
                </h1>
                <img
                  className="h-16 w-16 object-cover border-white border-2 rounded-full"
                  src={linkImagen}
                  alt="imagen perfil"
                />
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages[currentRoom]?.map((msg, index) => {
                  const isMine = msg.CHAT_SENDER === userId;
                  const isRead = msg.READ_STATUS && msg.READ_STATUS.length > 0;
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 max-w-xs rounded-lg shadow-md ${
                          isMine
                            ? "bg-headClassMatch text-white"
                            : "bg-accentClassMatch text-gray-800"
                        }`}
                      >
                        <p className="text-md">{msg.CHAT_MESSAGE}</p>
                        <span
                          className={`text-xs ${
                            isMine ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.CHAT_TIMESTAMP).toLocaleTimeString(
                            "es-CO",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "America/Bogota",
                            }
                          )}{" "}
                          {isRead && "✔✔"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t bg-white flex space-x-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-buttonClassMatch text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
              Selecciona un chat para empezar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
