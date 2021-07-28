import React, { useState, useEffect } from "react";
import { BsPersonSquare } from "react-icons/bs";
import "./game.scss";

function Square({ value, onClick, highlight }) {
  var class_css = "caroSquare";
  if (value === "O") {
    class_css = "caroSquare caro-o " + highlight;
  } else if (value === "X") {
    class_css = "caroSquare caro-x " + highlight;
  }
  return (
    <button className={class_css} onClick={onClick}>
      {value}
    </button>
  );
}

const Board = ({ squares, onClick, lastMove }) => (
  <div className="caroBoard">
    {squares.map((square, i) => {
      if (i === lastMove) {
        return (
          <Square
            key={i}
            value={square}
            highlight="caro-last-move"
            onClick={() => onClick(i)}
          />
        );
      } else {
        return (
          <Square
            key={i}
            value={square}
            highlight=""
            onClick={() => onClick(i)}
          />
        );
      }
    })}
  </div>
);

export default function Game({ socket, roomID, username }) {
  const [board, setBoard] = useState(Array(361).fill(null));
  var checkWinner = calculateWinner(board);

  const [gameStatus, setGameStatus] = useState("loading");
  const [piece, setPiece] = useState("");
  const [turn, setTurn] = useState("");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [points, setPoints] = useState(0);
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [lastMove, setLastMove] = useState(0);

  if (gameStatus === "loading") {
    console.log("loading");
    socket.emit("caro_game_status", { roomID, username });
  }

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (boardCopy[i] === null) {
      // Put an X or an O in the clicked square
      boardCopy[i] = piece;

      setLastMove(i);

      const last_move = i;
      console.log(i, last_move);
      //setBoard(boardCopy);
      socket.emit("caro_update_board", { roomID, boardCopy, turn, last_move });
      //setXisNext(!xIsNext);
      // If user click an occupied square or if game is won, return
      checkWinner = caroCalculateWinner(boardCopy, i);

      if (checkWinner) {
        console.log("checkWinner", checkWinner);
        socket.emit("caro_check_end_game", { roomID, checkWinner });
        return;
      }
    }
  };

  const handleClickNothing = (i) => {};

  const newGame = () => {
    socket.emit("caro_create_new_game", { roomID, username });
  };
  const undoGame = () => {};
  const drawGame = () => {};
  const leaveGame = () => {};

  useEffect(() => {
    socket.on("caro_game_status", ({ message, players }) => {
      console.log("gameStatus", message);
      setGameStatus(message);
      if (players[0].name === username) {
        setPiece(players[0].piece);
        if (message !== "waiting") {
          setOpponentPlayer(players[1].name);
        }
      } else {
        setPiece(players[1].piece);
        if (message !== "waiting") {
          setOpponentPlayer(players[0].name);
        }
      }
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
      console.log("caro_update_board", data.board, data.lastMove);
      setBoard(data.board);
      setTurn(data.turn);
      setLastMove(data.lastMove);
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
  }, [socket, turn, piece, username, board, lastMove]);

  switch (gameStatus) {
    case "waiting":
      return (
        <>
          <div className="top">
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name" style={{ color: "coral" }}>
                {username}
              </div>
            </div>
            <div className="info">
              <div className="roomid">
                <h5>
                  Room: <b>{roomID}</b>
                </h5>
              </div>
              <div className="scoreboard"></div>
            </div>
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name">Waiting...</div>
            </div>
          </div>
          <div className="bottom">
            <h1>Waiting ...</h1>
          </div>
        </>
      );
      // eslint-disable-next-line
      break;
    case "welcome":
      return (
        <>
          <div className="top">
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name" style={{ color: "coral" }}>
                {username}
              </div>
            </div>
            <div className="info">
              <div className="roomid">
                <h5>
                  Room: <b>{roomID}</b>
                </h5>
              </div>{" "}
              <div className="scoreboard">
                <div className="piece">{piece}</div>
                <div className="points">0 : 0</div>
                <div className="piece">
                  {piece === "X" ? "O" : piece === "O" ? "X" : ""}
                </div>
              </div>
            </div>
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name">{opponentPlayer}</div>
            </div>
          </div>
          <div className="bottom">
            <div className="controller">
              <button className="button start-game" onClick={newGame}>
                New Game
              </button>
              <button className="button leave" onClick={leaveGame}>
                Leave
              </button>
            </div>
          </div>
        </>
      );
      // eslint-disable-next-line
      break;
    case "starting":
      return (
        <>
          <div className="top">
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name" style={{ color: "coral" }}>
                {username}
              </div>
            </div>
            <div className="info">
              <div className="roomid">
                <h5>
                  Room: <b>{roomID}</b>
                </h5>
                <h5>
                  Turn: <b>{isYourTurn ? "You" : opponentPlayer}</b>
                </h5>
              </div>
              <div className="scoreboard">
                <div className="piece">{piece}</div>
                <div className="points">
                  {points} : {opponentPoints}
                </div>
                <div className="piece">
                  {piece === "X" ? "O" : piece === "O" ? "X" : ""}
                </div>
              </div>
            </div>
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name">{opponentPlayer}</div>
            </div>
          </div>
          {isYourTurn ? (
            <Board squares={board} lastMove={lastMove} onClick={handleClick} />
          ) : (
            <Board
              squares={board}
              lastMove={lastMove}
              onClick={handleClickNothing}
            />
          )}
          <div className="bottom">
            <div className="controller">
              <button className="button start-game" onClick={newGame}>
                New Game
              </button>

              <button className="button undo" onClick={undoGame}>
                Undo
              </button>
              <button className="button draw" onClick={drawGame}>
                Draw
              </button>
              <button className="button leave" onClick={leaveGame}>
                Leave
              </button>
            </div>
          </div>
        </>
      );
      // eslint-disable-next-line
      break;
    case "game end":
      return (
        <>
          <div className="top">
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name" style={{ color: "coral" }}>
                {username}
              </div>
            </div>
            <div className="info">
              <div className="roomid">
                <h5>
                  Room: <b>{roomID}</b>
                </h5>
                <h5>
                  Turn: <b>{isYourTurn ? "You" : opponentPlayer}</b>
                </h5>
              </div>
              <div className="scoreboard">
                <div className="piece">{piece}</div>
                <div className="points">
                  {points} : {opponentPoints}
                </div>
                <div className="piece">
                  {piece === "X" ? "O" : piece === "O" ? "X" : ""}
                </div>
              </div>
              <div className="roomid">
                <h5>
                  Winner: <b>{winner}</b>
                </h5>
              </div>
            </div>
            <div className="player">
              <div className="avatar">
                <BsPersonSquare />
              </div>
              <div className="player-name">{opponentPlayer}</div>
            </div>
          </div>
          <Board
            squares={board}
            lastMove={lastMove}
            onClick={handleClickNothing}
          />

          <div className="bottom">
            <div className="controller">
              <button className="button start-game" onClick={newGame}>
                New Game
              </button>

              <button className="button undo" onClick={undoGame}>
                Undo
              </button>
              <button className="button draw" onClick={drawGame}>
                Draw
              </button>
              <button className="button leave" onClick={leaveGame}>
                Leave
              </button>
            </div>
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
function caroCalculateWinner(board, last_move) {
  //check draw
  if (board.every((value) => value !== null)) {
    return "draw";
  }

  const init_col = last_move % 20;
  const init_row = (last_move - init_col) / 20;

  var piece = board[last_move];

  var newBoard = [];
  var tempList = [];
  var j = 0;
  for (let k = 0; k < board.length; k++) {
    if (j < 20) {
      tempList.push(board[k]);
      j = j + 1;
    } else {
      newBoard.push(tempList);
      tempList = [];
      tempList.push(board[k]);
      j = 1;
    }
  }
  newBoard.push(tempList);

  console.log("---------------------------------------------");
  console.log(
    "last_move: " + last_move,
    "piece: " + piece,
    "init_row: " + init_row,
    "init_col: " + init_col
  );

  console.log(newBoard);

  var count, col, row, last1, last2;

  //check column
  count = 1;
  last1 = init_row;
  last2 = init_row;

  row = init_row - 1;

  while (row >= 0 && newBoard[row][init_col] === piece) {
    count += 1;
    row = row - 1;
    last1 = row;
  }

  row = init_row + 1;
  while (row <= 19 && newBoard[row][init_col] === piece) {
    count += 1;
    row = row + 1;
    last2 = row;
  }

  if (count >= 5) {
    console.log(
      "last_move: ",
      last_move,
      ", piece: ",
      piece,
      ", init_row: ",
      init_row,
      ", init_col: ",
      init_col,
      ", count: ",
      count,
      ", last1: ",
      last1,
      ", last2: ",
      last2
    );
    if (last1 <= 0) {
      console.log("%cColumn1", "color: yellow");
      return board[last_move];
    } else if (last2 > 19) {
      console.log("%cColumn2", "color: yellow");
      return board[last_move];
    } else {
      if (
        newBoard[last1][init_col] === null ||
        newBoard[last2][init_col] === null
      ) {
        console.log("%cColumn3", "color: yellow");
        return board[last_move];
      }
    }
  }

  //check row
  count = 1;
  last1 = init_col;
  last2 = init_col;

  col = init_col - 1;
  while (col >= 0 && newBoard[init_row][col] === piece) {
    count += 1;
    col = col - 1;
    last1 = col;
  }

  col = init_col + 1;
  while (col <= 19 && newBoard[init_row][col] === piece) {
    count += 1;
    col = col + 1;
    last2 = col;
  }

  if (count >= 5) {
    console.log(
      "last_move: ",
      last_move,
      ", piece: ",
      piece,
      ", init_row: ",
      init_row,
      ", init_col: ",
      init_col,
      ", count: ",
      count,
      ", last1: ",
      last1,
      ", last2: ",
      last2
    );
    if (last1 <= 0) {
      console.log("%cRow1", "color: yellow");
      return board[last_move];
    } else if (last2 > 19) {
      console.log("%cRow2", "color: yellow");
      return board[last_move];
    } else {
      if (
        newBoard[init_row][last1] === null ||
        newBoard[init_row][last2] === null
      ) {
        console.log("%cRow3", "color: yellow");
        return board[last_move];
      }
    }
  }

  var last1_row, last1_col, last2_row, last2_col;
  //check cross left-right
  count = 1;
  last1_row = init_row;
  last1_col = init_col;
  last2_row = init_row;
  last2_col = init_col;

  row = init_row - 1;
  col = init_col - 1;
  while (row >= 0 && col >= 0 && newBoard[row][col] === piece) {
    count += 1;
    row = row - 1;
    col = col - 1;
    last1_row = row;
    last1_col = col;
  }

  row = init_row + 1;
  col = init_col + 1;
  while (row <= 19 && col <= 19 && newBoard[row][col] === piece) {
    count += 1;
    row = row + 1;
    col = col + 1;
    last2_row = row;
    last2_col = col;
  }

  if (count >= 5) {
    console.log(
      "last_move: ",
      last_move,
      ", piece: ",
      piece,
      ", init_row: ",
      init_row,
      ", init_col: ",
      init_col,
      ", count: ",
      count,
      ", last1_row: ",
      last1_row,
      ", last1_col: ",
      last1_col,
      ", last2_row: ",
      last2_row,
      ", last2_col: ",
      last2_col
    );
    if (last1_col <= 0) {
      console.log("%cCross-left-right1", "color: yellow");
      return board[last_move];
    } else if (last1_row <= 0) {
      console.log("%cCross-left-right2", "color: yellow");
      return board[last_move];
    } else if (last2_row > 19) {
      console.log("%cCross-left-right3", "color: yellow");
      return board[last_move];
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-left-right4", "color: yellow");
        return board[last_move];
      }
    }
  }

  //check cross right-left
  count = 1;
  last1_row = init_row;
  last1_col = init_col;
  last2_row = init_row;
  last2_col = init_col;

  row = init_row - 1;
  col = init_col + 1;
  while (row >= 0 && col <= 19 && newBoard[row][col] === piece) {
    count += 1;
    row = row - 1;
    col = col + 1;
    last1_row = row;
    last1_col = col;
  }

  row = init_row + 1;
  col = init_col - 1;
  while (row <= 19 && col >= 0 && newBoard[row][col] === piece) {
    count += 1;
    row = row + 1;
    col = col - 1;
    last2_row = row;
    last2_col = col;
  }

  if (count >= 5) {
    console.log(
      "last_move: ",
      last_move,
      ", piece: ",
      piece,
      ", init_row: ",
      init_row,
      ", init_col: ",
      init_col,
      ", count: ",
      count,
      ", last1_row: ",
      last1_row,
      ", last1_col: ",
      last1_col,
      ", last2_row: ",
      last2_row,
      ", last2_col: ",
      last2_col
    );
    if (last1_row <= 0) {
      console.log("%cCross-right-left1", "color: yellow");
      return board[last_move];
    } else if (last1_col >= 19) {
      console.log("%cCross-right-left2", "color: yellow");
      return board[last_move];
    } else if (last2_row >= 19) {
      console.log("%cCross-right-left3", "color: yellow");
      return board[last_move];
    } else if (last2_col <= 0) {
      console.log("%cCross-right-left4", "color: yellow");
      return board[last_move];
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-right-left5", "color: yellow");
        return board[last_move];
      }
    }
  }

  return null;
}
