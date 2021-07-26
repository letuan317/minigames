import React, { useState, useEffect } from "react";

const styleSquare = {
  background: "lightblue",
  border: "2px solid darkblue",
  fontSize: "30px",
  fontWeight: "800",
  cursor: "pointer",
  outline: "none",
};

const styleBoard = {
  border: "4px solid darkblue",
  borderRadius: "10px",
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
};

const Square = ({ value, onClick }) => (
  <button style={styleSquare} onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick }) => (
  <div style={styleBoard}>
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

export default function Game({ socket, roomID, username }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  var checkWinner = calculateWinner(board);

  const [gameStatus, setGameStatus] = useState("loading");
  const [piece, setPiece] = useState("");
  const [turn, setTurn] = useState("");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [points, setPoints] = useState(0);
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [opponentPoints, setOpponentPoints] = useState(0);

  if (gameStatus === "loading") {
    console.log("loading");
    socket.emit("caro_game_status", { roomID, username });
  }

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (boardCopy[i] === null) {
      // Put an X or an O in the clicked square
      boardCopy[i] = piece;

      //setBoard(boardCopy);
      socket.emit("caro_update_board", { roomID, boardCopy, turn });
      //setXisNext(!xIsNext);

      console.log("test", boardCopy);
      // If user click an occupied square or if game is won, return
      checkWinner = calculateWinner(boardCopy);

      if (checkWinner) {
        socket.emit("caro_check_end_game", { roomID, checkWinner });
        return;
      }
    }
  };

  const handleClickNothing = (i) => {};

  const newGame = () => {
    socket.emit("caro_create_new_game", { roomID, username });
    setBoard(Array(9).fill(null));
  };

  useEffect(() => {
    socket.on("caro_game_status", (message) => {
      console.log("gameStatus", message);
      setGameStatus(message);
    });
    socket.on("caro_created_new_game", (data) => {
      console.log("caro_created_new_game");
      setTurn(data.turn);
      if (data.players[0].name === username) {
        setPiece(data.players[0].piece);
        setOpponentPlayer(data.players[1].name);
      } else {
        setPiece(data.players[1].piece);
        setOpponentPlayer(data.players[0].name);
      }
      setWinner(null);
    });

    socket.on("caro_update_board", (data) => {
      console.log("caro_update_board", data.board);
      setBoard(data.board);
      setTurn(data.turn);
    });

    socket.on("caro_end_game", (data) => {
      console.log("caro_end_game", data);
      setWinner(data.player_win);
      if (data.players[0].name === username) {
        setPoints(data.players[0].points);
        setOpponentPoints(data.players[1].points);
      } else {
        setPoints(data.players[1].points);
        setOpponentPoints(data.players[0].points);
      }
    });

    if (turn === piece) {
      setIsYourTurn(true);
    } else {
      setIsYourTurn(false);
    }
  }, [socket, turn, piece, username]);

  switch (gameStatus) {
    case "waiting":
      return (
        <div style={{ position: "relative" }}>
          <h3>Info</h3>
          <p>Room ID: {roomID}</p>
          <p>Name: {username}</p>
          <p>
            Game Status: <i style={{ color: "red" }}>{gameStatus}</i>
          </p>
        </div>
      );
      // eslint-disable-next-line
      break;
    case "welcome":
      return (
        <div style={{ position: "relative" }}>
          <h3>Info</h3>
          <p>Room ID: {roomID}</p>
          <p>Name: {username}</p>
          <p>
            Game Status: <i style={{ color: "yellow" }}>{gameStatus}</i>
          </p>
          <button style={{ color: "black" }} onClick={newGame}>
            New Game
          </button>
        </div>
      );
      // eslint-disable-next-line
      break;
    case "starting":
      return (
        <>
          <div style={{ position: "relative" }}>
            <h3>Info</h3>
            <p>Room ID: {roomID}</p>
            <p>Name: {username}</p>
            <p>Piece: {piece}</p>
            <p>Turn: {turn}</p>
            <p>
              Game Status: <i style={{ color: "green" }}>{gameStatus}</i>
            </p>
            <p>
              You {points} : {opponentPoints} {opponentPlayer}
            </p>
            <div>
              <p>
                {winner ? (
                  <>
                    <p>Winner: {winner}</p>
                    <button style={{ color: "black" }} onClick={newGame}>
                      New Game
                    </button>
                  </>
                ) : (
                  "Next Player: " + (isYourTurn ? "You" : opponentPlayer)
                )}
              </p>
            </div>
            {isYourTurn ? (
              <Board squares={board} onClick={handleClick} />
            ) : (
              <Board squares={board} onClick={handleClickNothing} />
            )}
          </div>
        </>
      );
      // eslint-disable-next-line
      break;
    case "game end":
      return (
        <>
          <div style={{ position: "relative" }}>
            <h3>Info</h3>
            <p>Room ID: {roomID}</p>
            <p>Name: {username}</p>
            <p>Piece: {piece}</p>
            <p>Turn: {turn}</p>
            <p>
              Game Status: <i style={{ color: "blue" }}>{gameStatus}</i>
            </p>
            <p>
              You {points} : {opponentPoints} {opponentPlayer}
            </p>
            <div>
              <p>Winner: {winner}</p>
              <button style={{ color: "black" }} onClick={newGame}>
                New Game
              </button>
            </div>
            {isYourTurn ? (
              <Board squares={board} onClick={handleClickNothing} />
            ) : (
              <Board squares={board} onClick={handleClickNothing} />
            )}
          </div>
        </>
      );
      // eslint-disable-next-line
      break;
    default:
      return <div>Loading...</div>;
  }
}

// ========================================

function calculateWinner(board) {
  //check draw
  if (board.every((value) => value !== null)) {
    return "draw";
  }

  //check win
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
