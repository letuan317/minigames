const caroUsers = [];
const caroBoards = [];

function caroNewBoard(room) {
  const board = Array(9).fill(null);
  const caro_board = { room, board };
  const index = caroBoards.findIndex((caro_board) => caro_board.room === room);
  if (index !== -1) {
    caroBoards[index].board = board;
  } else {
    caroBoards.push(caro_board);
  }
  return board;
}

// joins the user to the specific chatroom
function caroJoinUser(id, room, username, piece) {
  const caro_p_user = { id, room, username, piece };

  caroUsers.push(caro_p_user);

  return caro_p_user;
}

// Gets a particular user id to return the current user
function caroGetCurrentUser(id) {
  return caroUsers.find((caro_p_user) => caro_p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function caroUserDisconnect(id) {
  const index = caroUsers.findIndex((caro_p_user) => caro_p_user.id === id);

  if (index !== -1) {
    return caroUsers.splice(index, 1)[0];
  }
}

const caroRandRoom = () => {
  var result = "";
  var hexChars = "0123456789";
  for (var i = 0; i < 6; i += 1) {
    result += hexChars[Math.floor(Math.random() * 6)];
  }
  return result;
};

const caroRandPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

function caroNoPeopleInRoom() {
  return caroUsers.length;
}

module.exports = {
  caroNewBoard,
  caroUsers,
  caroJoinUser,
  caroGetCurrentUser,
  caroUserDisconnect,
  caroRandRoom,
  caroRandPiece,
  caroNoPeopleInRoom,
};
