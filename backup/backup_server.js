const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { get_Current_User, user_Disconnect, join_User } = require("./dummyuser");
const {
  caroNewBoard,
  caroUsers,
  caroJoinUser,
  caroGetCurrentUser,
  caroUserDisconnect,
  caroRandRoom,
  caroRandPiece,
  caroNoPeopleInRoom,
} = require("./utilities/carodummyuser");
/* CARO GAME */
const {
  CaroRandRoom,
  CaroRandPiece,
  CaroRooms,
  CaroPlayer,
  CaroBoard,
  CaroMakeRoom,
  CaroJoinRoom,
  CaroKick,
  CaroGetRoomPlayersNum,
  CaroPieceAssignment,
  CaroNewGame,
} = require("./utilities/caroFunctions");

app.use(express());
app.use(cors());

const port = 8000;

var server = app.listen(
  port,
  console.log(`Server is running on the port no: ${port} `.green)
);

const io = socket(server);

//initializing the socket io connection
io.on("connection", (socket) => {
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
  });
  /* +++++++++++++++++++++++++++++++++++++++++++++++++*/

  /* +++++++++++++++++++++++++++++++++ CARO GAME +++++++++++++++++++++++++++++++++*/
  /*
  CaroRandRoom, CaroRandPiece, CaroRooms, CaroPlayer, CaroBoard, CaroMakeRoom,
  CaroJoinRoom, CaroKick, CaroGetRoomPlayersNum, CaroPieceAssignment, CaroNewGame,
  */
  /*
  //On the client submit event (on start page) to create a new room
  socket.on("caroCreateRoom", ({ username }) => {
    console.log(username, "request create a new caro game");
    new Promise(CaroMakeRoom).then((room) => {
      console.log(room, "created");
      console.log(CaroRooms);

      socket.emit("caroNewGameCreated", { username, room });
    });
  });

  //On the client submit event (on start page) to join a room
  socket.on("caroJoining", ({ room }) => {
    if (CaroRooms.has(room)) {
      console.log(room, "caroJoining", "caroJoinConfirmed");
      socket.emit("caroJoinConfirmed", { room });
    } else {
      console.log(room, "errorMessage", "No room with that id found");
      socket.emit("errorMessage", "No room with that id found");
    }
  });

  socket.on("caroNewRoomJoin", ({ room, username }) => {
    console.log(room, "request join in", username);
    //Put the new player into the room
    socket.join(room);
    const id = socket.id;

    //Get the number of player in the room
    const peopleInRoom = CaroGetRoomPlayersNum(room);
    console.log("room has", peopleInRoom, "in", room);

    //Need another player so emit the waiting event
    //to display the wait screen on the front end
    if (peopleInRoom === 0) {
      const newPlayer = new CaroPlayer(id, username, room);
      CaroJoinRoom(newPlayer, room);

      console.log("caroNewRoomJoin", newPlayer, "was created in", room);
      io.to(room).emit("caroWaiting");
    }

    //The right amount of people so we start the game
    if (peopleInRoom === 1) {
      const newPlayer = new CaroPlayer(id, username, room);
      CaroJoinRoom(newPlayer, room);

      console.log("caroNewRoomJoin", "newPlayer", "was created in", "room");
      //Assign the piece to each player in the backend data structure and then
      //emit it to each of the player so they can store it in their state
      CaroPieceAssignment(room);
      currentPlayers = CaroRooms.get(room).players;
      for (const player of currentPlayers) {
        io.to(player.id).emit("caroPieceAssignment", {
          piece: player.piece,
          id: player.id,
        });
      }
      CaroNewGame(room);

      //When starting, the game state, turn and the list of both players in
      //the room are required in the front end to render the correct information
      const currentRoom = CaroRooms.get(room);
      const gameState = currentRoom.board.game;
      const turn = currentRoom.board.turn;
      const players = currentRoom.players.map((player) => [
        player.id,
        player.name,
        player.piece,
      ]);
      console.log(gameState, players, turn);
      io.to(room).emit("caroStarting", { gameState, players, turn });
    }

    //Too many people so we kick them out of the room and redirect
    //them to the main starting page
    if (peopleInRoom >= 2) {
      const peopleInRoom = CaroGetRoomPlayersNum(room);
      console.log("room has", peopleInRoom, "in", room);
      socket.leave(room);
      CaroKick(room);
      io.to(socket.id).emit("joinError");
    }
  });
  */
  /* +++++++++++++++++++++++++++++++++++++++++++++++++*/

  /* +++++++++++++++++++++++ Demo ++++++++++++++++++++++++++*/
  //for a new user joining the room
  socket.on("caroJoinRoom", ({ username, room }) => {
    //* create user
    no_peopleInRoom = caroNoPeopleInRoom();
    console.log(
      "caroJoinRoom",
      username,
      "request no of players",
      no_peopleInRoom
    );
    console.log("caroJoinRoom", username, "request show players", caroUsers);

    var piece = "";
    if (no_peopleInRoom == 0) {
      piece = "O";
    }
    if (no_peopleInRoom == 1) {
      if (caroUsers[0].piece == "O") {
        piece = "X";
      } else {
        piece = "O";
      }
    }

    const caro_p_user = caroJoinUser(socket.id, room, username, piece);
    console.log("caroJoinRoom", "create new player:", caro_p_user);
    socket.join(caro_p_user.room);
    socket.emit("caroConfirmedJoinRoom", true);

    //display a welcome message to the user who have joined a room
    socket.emit("caroMessage", {
      userId: caro_p_user.id,
      username: caro_p_user.username,
      piece: caro_p_user.piece,
      text: `Welcome ${caro_p_user.username}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(caro_p_user.room).emit("caroMessage", {
      userId: caro_p_user.id,
      username: caro_p_user.username,
      text: `${caro_p_user.username} has joined the chat`,
    });
  });

  //user sending message
  socket.on("caroChat", (text) => {
    //gets the room user and the message sent
    const caro_p_user = get_Current_User(socket.id);

    io.to(caro_p_user.room).emit("caroMessage", {
      userId: caro_p_user.id,
      username: caro_p_user.username,
      text: text,
    });
  });

  socket.on("caroCheckGameStatus", ({ room, username }) => {
    no_peopleInRoom = caroNoPeopleInRoom();
    console.log(
      "caroCheckGameStatus",
      username,
      "request no of players",
      no_peopleInRoom
    );
    console.log(
      "caroCheckGameStatus",
      username,
      "request show players",
      caroUsers
    );

    if (no_peopleInRoom == 1) {
      io.to(room).emit("caroGameStatus", "waiting");
    }
    if (no_peopleInRoom == 2) {
      io.to(room).emit("caroGameStatus", "startGame");
    }
  });

  socket.on("caroStartNewGame", ({ room, username }) => {
    const turn = caroRandPiece();
    const board = caroNewBoard();
    io.to(room).emit("caroNewGameInit", {
      gameStatus: "starting",
      board: board,
      turn: turn,
    });
  });

  /* +++++++++++++++++++++++++++++++++++++++++++++++++*/
});
