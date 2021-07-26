//utilities functions and classes
const { rand_room_id, rand_player_id } = require("./utilities");

class caro_player {
  constructor(userID, name, roomID, piece = "", points = 0) {
    this.id = userID;
    this.name = name;
    this.roomID = roomID;
    this.piece = piece;
    this.points = points;
  }
}

function caro_make_room(Rooms) {
  var roomID = rand_room_id();
  while (Rooms.has(roomID)) {
    roomID = rand_room();
  }
  Rooms.set(roomID, { roomID: roomID, players: [], board: [] });
  return roomID;
}

function caro_rand_piece() {
  return Math.random() > 0.5 ? "X" : "O";
}

//Initialize a new board to a room
function caro_new_game(Rooms, roomID) {
  currentRoom = Rooms.get(roomID);
  const board = Array(9).fill(null);
  currentRoom.board = board;
}

//Put the newly joined player into a room's player list
const caro_player_join_room = (Rooms, roomID, player) => {
  currentRoom = Rooms.get(roomID);
  updatedPlayerList = currentRoom.players.push(player);
  updatedRoom = { ...currentRoom, players: updatedPlayerList };
};

//Remove the latest player joined from a room's player list
function caro_kick(Rooms, roomID) {
  currentRoom = Rooms.get(roomID);
  currentRoom.players.pop();
}

//Check how many player is currently in the room
function caro_get_number_of_players(Rooms, roomID) {
  return Rooms.get(roomID).players.length;
}

//Assign x o values to each of the player class
function caro_piece_assignment(Rooms, roomID) {
  const firstPiece = caro_rand_piece();
  const lastPiece = firstPiece === "X" ? "O" : "X";

  currentRoom = Rooms.get(roomID);
  currentRoom.players[0].piece = firstPiece;
  currentRoom.players[1].piece = lastPiece;
}

//check winner
function caro_check_winner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function caro_create_new_board() {
  return new Array(9).fill(null);
}

function caro_switch_turn(turn) {
  if (turn === "X") {
    return "O";
  } else {
    return "X";
  }
}

module.exports = {
  caro_player,
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
};
