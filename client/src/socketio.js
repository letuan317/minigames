import io from "socket.io-client";

const url_proxy = "http://24.7.115.67:8000/";

export const socket = io.connect(url_proxy, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const socketID = socket.id;
