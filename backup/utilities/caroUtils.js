const CaroRandRoom = () => {
  var result = "";
  var hexChars = "0123456789";
  for (var i = 0; i < 6; i += 1) {
    result += hexChars[Math.floor(Math.random() * 6)];
  }
  return result;
};

const CaroRandPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { CaroRandRoom, CaroRandPiece };
