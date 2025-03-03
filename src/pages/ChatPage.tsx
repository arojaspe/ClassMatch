import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  CHAT_ROOM: string;
  CHAT_ID: string;
  CHAT_SENDER: string;
  CHAT_MESSAGE: string;
  CHAT_TIMESTAMP: string;
  READ_STATUS?: { RS_USER: string; RS_TIMESTAMP: string }[];
}

interface Room {
  NEW: boolean;
  ROOM_ID: string;
  USER_FIRSTNAME: string;
  USER_IMAGE: string;
}

interface Event {
  ROOM_ID: string;
  EVENT_TITLE: string;
  EVENT_IMAGES: string;
}

const socketUrl = "http://localhost:5000";

const ChatPage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ [roomId: string]: ChatMessage[] }>({});
  const [messageText, setMessageText] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const currentRoomRef = useRef<string | null>(null);
  const messagesRef = useRef<{ [roomId: string]: ChatMessage[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [personaChat, setPersonaChat] = useState<string>("");
  const [linkImagen, setLinkImagen] = useState<string>("");
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesTimeout, setMessagesTimeout] = useState(false);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = currentUser ? currentUser.USER_ID : null;

  useEffect(() => {
    currentRoomRef.current = currentRoom;
    messagesRef.current = messages;
  }, [currentRoom, messages]);

  // Inject global CSS for the custom scrollbar
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const getDisplayDate = (date: Date): string => {
    const todayStr = new Date().toLocaleDateString("es-CO");
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toLocaleDateString("es-CO");
    const targetStr = date.toLocaleDateString("es-CO");
    if (targetStr === todayStr) return "Hoy";
    if (targetStr === yesterdayStr) return "Ayer";
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Conectado con socket id:", newSocket.id);
      newSocket.emit("register", { current_user: userId });
    });

    newSocket.on("my_chats", (data: { users: Room[]; events: Event[] }) => {
      setRooms(data.users);
      setRoomsLoading(false);
    });

    newSocket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });

    newSocket.on("receive", (newMessage: ChatMessage) => {
      const currentRoom = currentRoomRef.current;
      if (!currentRoom) return;

      // Compare with the ref value
      if (newMessage.CHAT_ROOM.toString() !== currentRoom) return;

      setMessages(prev => ({
        ...prev,
        [currentRoom]: [...(prev[currentRoom] || []), newMessage]
      }));
    });

    newSocket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    // New message notification handler
    newSocket.on("new_message_notification", ({ roomId }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        // Only mark as new if NOT the current room
        if (room.ROOM_ID === roomId && roomId !== currentRoomRef.current) {
          return { ...room, NEW: true };
        }
        return room;
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket && currentRoom) {
      setIsMessagesLoading(true);
      setMessagesTimeout(false);
      const timeoutId = setTimeout(() => setMessagesTimeout(true), 3000);

      socket.emit("get", { current_user: userId, room: currentRoom, page: 1 });

      const roomMessagesHandler = (msgs: ChatMessage[]) => {
        clearTimeout(timeoutId);
        setIsMessagesLoading(false);
        setMessagesTimeout(false);
        setMessages((prev) => ({ ...prev, [currentRoom]: msgs }));
      };

      socket.on("room_messages", roomMessagesHandler);

      return () => {
        clearTimeout(timeoutId);
        socket.off("room_messages", roomMessagesHandler);
      };
    }
  }, [currentRoom, socket, userId]);

  const handleRoomClick = (room: Room) => {
    setCurrentRoom(room.ROOM_ID);
    setPersonaChat(room.USER_FIRSTNAME);
    setLinkImagen(room.USER_IMAGE);
    setRooms(prevRooms => prevRooms.map(r =>
      r.ROOM_ID === room.ROOM_ID ? { ...r, NEW: false } : r
    ));
  };

  const handleSendMessage = () => {
    if (socket && currentRoom && messageText.trim()) {
      const now = new Date();
      socket.emit("send", {
        current_user: userId,
        room: currentRoom,
        message: messageText,
      });
      setMessages((prev) => ({
        ...prev,
        [currentRoom]: [
          ...(prev[currentRoom] || []),
          {
            CHAT_ROOM: currentRoom,
            CHAT_ID: uuidv4(),
            CHAT_SENDER: userId,
            CHAT_MESSAGE: messageText,
            CHAT_TIMESTAMP: now.toISOString(),
            READ_STATUS: [],
          },
        ],
      }));
      setMessageText("");
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, currentRoom]);

  return (
    <div className="flex items-center justify-center h-screen bg-backgroundClassMatch">
      <div className="flex my-[12vh] mx-auto w-full max-w-5xl h-[75vh] font-KhandRegular bg-mainClassMatch rounded-xl shadow-lg overflow-hidden">
        {/* Sidebar with Rooms */}
        <div className="w-1/4 bg-accentClassMatch p-6 border-r">
          {roomsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.ROOM_ID}
                  className={`p-3 rounded-lg cursor-pointer transition duration-300 flex items-center justify-between ${currentRoom === room.ROOM_ID
                      ? "bg-mainClassMatch text-white text-lg font-KhandSemiBold shadow-md"
                      : "bg-white text-lg font-KhandSemiBold hover:bg-gray-200"
                    }`}
                  onClick={() => handleRoomClick(room)}
                >
                  <span>{room.USER_FIRSTNAME}</span>
                  <img
                    className={`h-16 w-16 object-cover rounded-full ${room.NEW && currentRoom !== room.ROOM_ID
                        ? "border-4 border-green-500"
                        : "border-2 border-white"
                      }`}
                    src={room.USER_IMAGE}
                    alt="imagen perfil"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {currentRoom ? (
            <>
              <div className="p-5 border-b flex items-center justify-between bg-headClassMatch shadow-sm">
                <h1 className="text-xl font-semibold text-gray-100">{personaChat}</h1>
                <img
                  className="h-16 w-16 object-cover border-white border-2 rounded-full"
                  src={linkImagen}
                  alt="imagen perfil"
                />
              </div>

              {isMessagesLoading ? (
                messagesTimeout ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                    Todavía no hay mensajes aquí
                  </div>
                ) : (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="animate-pulse space-y-3">
                      <div className="h-12 bg-gray-300 rounded"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                )
              ) : (
                <div
                  ref={messagesContainerRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar"
                >
                  {messages[currentRoom]
                    ?.sort(
                      (a, b) =>
                        new Date(a.CHAT_TIMESTAMP).getTime() -
                        new Date(b.CHAT_TIMESTAMP).getTime()
                    )
                    .map((msg, index, arr) => {
                      const parsedDate = new Date(msg.CHAT_TIMESTAMP);
                      const msgDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                      const prevMsgDate =
                        index > 0 ? new Date(arr[index - 1].CHAT_TIMESTAMP) : null;
                      const isNewDay =
                        !prevMsgDate ||
                        msgDate.toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) !==
                        prevMsgDate.toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      const isMine = msg.CHAT_SENDER === userId;
                      const isRead = msg.READ_STATUS && msg.READ_STATUS.length > 0;

                      return (
                        <React.Fragment key={index}>
                          {isNewDay && (
                            <div className="text-center my-4">
                              <span className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                {getDisplayDate(msgDate)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`p-3 max-w-xs rounded-lg shadow-md ${isMine
                                  ? "bg-headClassMatch text-white"
                                  : "bg-accentClassMatch text-gray-800"
                                }`}
                            >
                              <p className="text-md">{msg.CHAT_MESSAGE}</p>
                              <span className={`text-xs ${isMine ? "text-gray-200" : "text-gray-500"}`}>
                                {msgDate.toLocaleTimeString("es-CO", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                  timeZone: "America/Bogota",
                                })}{" "}
                                {isRead && "✔✔"}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                </div>
              )}
              <div className="p-4 border-t bg-white flex space-x-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && messageText.trim()) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
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