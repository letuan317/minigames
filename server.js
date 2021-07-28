const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const {
  caro_player,
  caro_history,
  caro_make_room,
  caro_rand_piece,
  caro_new_game,
  caro_player_join_room,
  caro_kick,
  caro_get_number_of_players,
  caro_piece_assignment,
  caro_check_winner,
  caro_create_new_board,
  caro_switch_turn,
} = require("./utilities/caro");

const { rand_room_id, rand_player_id } = require("./utilities/utilities");

app.use(express());
app.use(cors());

const port = 8000;

var server = app.listen(
  port,
  console.log(`Server is running on the port no: ${port} `.green)
);

const io = socket(server);

const Rooms = new Map();
// client = socket.id, name, last_room
const AllClients = [];

class Client {
  constructor(userID, roomID) {
    this.userID = userID;
    this.roomID = roomID;
  }
}

function update_client(userID, roomID) {
  index = AllClients.findIndex((client) => client.id === userID);
  if (index !== -1) {
    AllClients[index].roomID = roomID;
  } else {
    new_client = { userID, roomID };
    AllClients.push(new_client);
  }
}

//initializing the socket io connection
io.on("connection", (socket) => {
  userID = socket.id;

  socket.on("test-client", (message) => {
    console.log(message);
  });
  socket.emit("test-server", "server response");

  /* +++++++++++++++++++++++++++++++++ CHAT APP +++++++++++++++++++++++++++++++++*/
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  //when the user exits the room
  /*
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the chat`,
      });
    }
  });*/
  /* +++++++++++++++++++++++++++++++++++++++++++++++++*/

  /* +++++++++++++++++++++++ Demo ++++++++++++++++++++++++++*/
  socket.on("caro_create_new_room", (username) => {
    console.log(
      "caro_create_new_room",
      username,
      userID,
      "request create new room"
    );

    const roomID = caro_make_room(Rooms);
    socket.join(roomID);

    const player = new caro_player(userID, username, roomID);

    caro_player_join_room(Rooms, roomID, player);

    console.log("caro_create_new_room", roomID, "was created");
    console.log("caro_create_new_room", Rooms.get(roomID));

    socket.emit("caro_created_new_room", {
      roomID,
      username,
    });

    update_client(userID, roomID);
  });

  socket.on("caro_join_room", ({ roomID, username }) => {
    console.log("caro_join_room", roomID, username, "request ");

    if (Rooms.has(roomID)) {
      console.log("caro_join_room", roomID, "exists");
      const players = Rooms.get(roomID).players;
      const numberOfPlayers = caro_get_number_of_players(Rooms, roomID);

      if (numberOfPlayers == 1) {
        if (players[0].name !== username) {
          console.log("caro_join_room", roomID, username, "can join");
          userID = socket.id;
          socket.join(roomID);

          const player = new caro_player(userID, username, roomID);

          caro_player_join_room(Rooms, roomID, player);

          console.log("caro_join_room", Rooms.get(roomID));

          socket.emit("caro_joined_room", {
            roomID,
            username,
          });

          update_client(userID, roomID);
        } else {
          socket.emit("error_message", "Name is exist, Choose another name");
        }
      } else {
        socket.emit(
          "error_message",
          "Room is not available, no of players: " + numberOfPlayers
        );
      }
    } else {
      socket.emit("error_message", "No room is found");
    }
  });

  socket.on("caro_game_status", ({ roomID, username }) => {
    const numberOfPlayers = caro_get_number_of_players(Rooms, roomID);

    console.log(
      "caro_game_status",
      roomID,
      username,
      "request ",
      numberOfPlayers
    );
    const currentRoom = Rooms.get(roomID);
    const players = currentRoom.players;
    var message = "";
    if (numberOfPlayers == 1) {
      message = "waiting";
      io.to(roomID).emit("caro_game_status", { message, players });
    } else if (numberOfPlayers == 2) {
      message = "welcome";
      io.to(roomID).emit("caro_game_status", { message, players });
    }
  });

  socket.on("caro_create_new_game", ({ roomID, username }) => {
    console.log(
      "caro_create_new_game",
      roomID,
      username,
      "request create new game "
    );

    if (Rooms.has(roomID)) {
      console.log("caro_create_new_game", roomID, "exists");
      var currentRoom = Rooms.get(roomID);
      caro_new_game(Rooms, roomID);
      var turn = caro_rand_piece();
      if (currentRoom.lastWinner === null) {
        turn = caro_rand_piece();
        caro_piece_assignment(Rooms, roomID);
      } else {
        if (currentRoom.lastWinner === "X") {
          turn = "O";
        } else if (currentRoom.lastWinner === "O") {
          turn = "X";
        }
      }

      const players = currentRoom.players;
      io.to(roomID).emit("caro_created_new_game", {
        players: currentRoom.players,
        turn: turn,
      });
      io.to(roomID).emit("caro_update_board", {
        board: currentRoom.board,
        turn: turn,
      });
      const message = "starting";

      io.to(roomID).emit("caro_game_status", { message, players });
    }
  });

  socket.on("caro_update_board", ({ roomID, boardCopy, turn, last_move }) => {
    console.log("caro_update_board", roomID, "request update board");

    if (Rooms.has(roomID)) {
      console.log("caro_update_board", roomID, boardCopy, turn, last_move);
      var currentRoom = Rooms.get(roomID);
      const history = new caro_history(currentRoom.board, turn, last_move);
      currentRoom.history.unshift(history);
      currentRoom.board = boardCopy;
      const newTurn = caro_switch_turn(turn);
      io.to(roomID).emit("caro_update_board", {
        board: currentRoom.board,
        turn: newTurn,
        lastMove: last_move,
      });
    }
  });

  socket.on("caro_check_end_game", ({ roomID, checkWinner }) => {
    console.log("caro_check_end_game", roomID, checkWinner, "request end game");

    if (Rooms.has(roomID)) {
      if (checkWinner === "draw") {
        io.to(roomID).emit("caro_check_end_game", "draw");
      } else {
        var currentRoom = Rooms.get(roomID);
        var players = currentRoom.players;
        var player_win = "";
        currentRoom.lastWinner = checkWinner;
        if (currentRoom.players[0].piece === checkWinner) {
          player_win = currentRoom.players[0].name;
          currentRoom.players[0].points = currentRoom.players[0].points + 1;
        } else {
          player_win = currentRoom.players[1].name;
          currentRoom.players[1].points = currentRoom.players[1].points + 1;
        }
        console.log("test", player_win, players);
        io.to(roomID).emit("caro_end_game", {
          player_win: player_win,
          players: players,
        });
        const message = "game end";
        io.to(roomID).emit("caro_game_status", { message, players });
      }
    }
  });

  //when the user exits the room

  socket.on("disconnect", () => {
    const index = AllClients.findIndex((client) => client.userID === userID);

    if (index !== -1) {
      roomID = AllClients[index].roomID;
      if (Rooms.has(roomID)) {
        var currentRoom = Rooms.get(roomID);
        var players = currentRoom.players;
        const index_player = players.findIndex(
          (player) => player.id === userID
        );
        if (index_player !== -1) {
          player_left = players[index_player].name;
          players.splice(index_player, 1)[0];

          const numberOfPlayers = caro_get_number_of_players(Rooms, roomID);

          if (numberOfPlayers == 1) {
            io.to(roomID).emit("caro_game_status", "waiting");
            console.log(
              "disconnect",
              userID,
              player_left,
              "left the room",
              roomID
            );
          } else if (numberOfPlayers == 0) {
            currentRoom = Rooms.get(roomID);
            Rooms.delete(currentRoom);
            console.log(
              "disconnect",
              userID,
              player_left,
              "left the room and",
              roomID,
              "deleted"
            );
          }
        }
      }
    }
  });
  /* +++++++++++++++++++++++++++++++++++++++++++++++++*/
});
