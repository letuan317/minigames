class CaroPlayer {
  constructor(id, name, room, piece = "", turn) {
    this.id = id;
    this.name = name;
    this.room = room;
    this.piece = piece;
    this.turn = turn;
  }
}

module.exports = CaroPlayer;
