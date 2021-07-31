import io from "socket.io-client";

//const url_proxy = "https://minigamesio.herokuapp.com/";
const url_proxy = "http://localhost:8000/";

export const socket = io.connect(url_proxy, {
  transports: ["websocket", "polling", "flashsocket"],
});

export const socketID = socket.id;

console.log();
socket.emit("test-client", "Hello server");
