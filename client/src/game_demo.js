import React, { useState } from "react";
import { BsPersonSquare } from "react-icons/bs";

import "caro/game.scss";
// eslint-disable-next-line
import { test_action, caroCalculateWinner } from "./caro/utilities";

// eslint-disable-next-line
const styleSquare = {
  background: "lightblue",
  border: "1px solid darkblue",
  fontSize: "15px",
  fontWeight: "800",
  cursor: "pointer",
  outline: "none",
};
// eslint-disable-next-line
const styleBoard = {
  border: "4px solid darkblue",
  borderRadius: "5px",
  width: "500px",
  height: "500px",
  margin: "0 auto",
  display: "grid",
  gridTemplate: "repeat(19, 1fr) / repeat(19, 1fr)",
};

function Square({ value, onClick }) {
  var class_css = "caroSquare";
  if (value === "O") {
    class_css = "caroSquare caro-o";
  } else if (value === "X") {
    class_css = "caroSquare caro-x";
  }
  return (
    <button className={class_css} onClick={onClick}>
      {value}
    </button>
  );
}
// eslint-disable-next-line

const Board = ({ squares, onClick }) => (
  <div className="caroBoard">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

export default function GameDemo() {
  const [board, setBoard] = useState(Array(400).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [lastMove, setLastMove] = useState();
  const winner = caroCalculateWinner(board, lastMove);

  const handleClick = (i) => {
    const boardCopy = [...board];
    // If user click an occupied square or if game is won, return
    if (winner || boardCopy[i]) return;
    // Put an X or an O in the clicked square
    boardCopy[i] = xIsNext ? "X" : "O";
    setLastMove(i);
    setBoard(boardCopy);
    setXisNext(!xIsNext);
  };

  test_action();

  return (
    <div className="caroContainer">
      <>
        <div className="top">
          <div className="player">
            <div className="avatar">
              <BsPersonSquare />
            </div>
            <div className="player-name" style={{ color: "coral" }}>
              Player 1
            </div>
          </div>
          <div className="info">
            <div className="roomid">
              <h5>
                Room: <b>123456</b>
              </h5>
              <h5>
                Turn: <b>You</b>
              </h5>
            </div>
            <div className="scoreboard">
              <div className="piece">O</div>
              <div className="points">1 : 0</div>
              <div className="piece">X</div>
            </div>
          </div>
          <div className="player">
            <div className="avatar">
              <BsPersonSquare />
            </div>
            <div className="player-name">Player 2</div>
          </div>
        </div>
        <Board squares={board} onClick={handleClick} />
        <div className="bottom">
          <div className="controller">
            <button className="button start-game">New Game</button>
            <button className="button undo">Undo</button>
            <button className="button draw">Draw</button>
            <button className="button leave">Leave</button>
          </div>
        </div>
      </>
    </div>
  );
}

/*<div>
 <p>
          {winner ? (
            <>
              <p>Winner: {winner}</p>
            </>
          ) : (
            "Next Player: " + (xIsNext ? "X" : "O")
          )}
        </p>
      </div>
*/
// ========================================
