//utilities functions and classes
const { CaroRandRoom, CaroRandPiece } = require("./caroUtils");
const CaroPlayer = require("./caroPlayer");
const CaroBoard = require("./caroBoard");

//Store the room ids mapping to the room property object
//The room property object looks like this {roomid:str, players:Array(2)}
const CaroRooms = new Map();

//Promise function to make sure room id is unique
const CaroMakeRoom = (resolve) => {
  var newRoom = CaroRandRoom();
  while (CaroRooms.has(newRoom)) {
    newRoom = CaroRandRoom();
  }
  CaroRooms.set(newRoom, { roomId: newRoom, players: [], board: null });
  resolve(newRoom);
};

//Put the newly joined player into a room's player list
const CaroJoinRoom = (player, room) => {
  currentRoom = CaroRooms.get(room);
  updatedPlayerList = currentRoom.players.push(player);
  updatedRoom = { ...currentRoom, players: updatedPlayerList };
};

//Remove the latest player joined from a room's player list
function CaroKick(room) {
  currentRoom = CaroRooms.get(room);
  currentRoom.players.pop();
}

//Check how many player is currently in the room
function CaroGetRoomPlayersNum(room) {
  return CaroRooms.get(room).players.length;
}

//Assign x o values to each of the player class
function CaroPieceAssignment(room) {
  const firstPiece = CaroRandPiece();
  const lastPiece = firstPiece === "X" ? "O" : "X";

  currentRoom = CaroRooms.get(room);
  currentRoom.players[0].piece = firstPiece;
  currentRoom.players[1].piece = lastPiece;
}

//Initialize a new board to a room
function CaroNewGame(room) {
  currentRoom = CaroRooms.get(room);
  const board = new CaroBoard();
  currentRoom.board = board;
}

module.exports = {
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
};
