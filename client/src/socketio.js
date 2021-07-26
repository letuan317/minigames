import io from "socket.io-client";

export const socket = io.connect("http://localhost:8000/", {
  transports: ["websocket", "polling", "flashsocket"],
});

export const socketID = socket.id;
