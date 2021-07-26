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

export default function GameDemo() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i) => {
    const boardCopy = [...board];
    // If user click an occupied square or if game is won, return
    if (winner || boardCopy[i]) return;
    // Put an X or an O in the clicked square
    boardCopy[i] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXisNext(!xIsNext);
  };

  const newGame = () => {
    setBoard(Array(9).fill(null));
  };

  return (
    <>
      <Board squares={board} onClick={handleClick} />
      <div>
        <p>
          {winner ? (
            <>
              <p>Winner: {winner}</p>
              <button onClick={newGame}>New Game</button>
            </>
          ) : (
            "Next Player: " + (xIsNext ? "X" : "O")
          )}
        </p>
      </div>
    </>
  );
}

// ========================================

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
