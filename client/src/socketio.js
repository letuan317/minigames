import io from "socket.io-client";

export const socket = io.connect("http://192.168.1.27:8000/", {
  transports: ["websocket", "polling", "flashsocket"],
});

export const socketID = socket.id;
