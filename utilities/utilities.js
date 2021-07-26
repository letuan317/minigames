var hexChars = "0123456789";

const rand_room_id = () => {
  var result = "";
  for (var i = 0; i < 6; i += 1) {
    result += hexChars[Math.floor(Math.random() * 6)];
  }
  return result;
};

const rand_player_id = () => {
  var result = "";
  for (var i = 0; i < 6; i += 1) {
    result += hexChars[Math.floor(Math.random() * 6)];
  }
  return result;
};

module.exports = { rand_room_id, rand_player_id };
