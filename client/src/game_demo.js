import React, { useState } from "react";
import "caro/game.scss";
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

function test_action() {
  console.log("Testing");

  const test_cases = [
    [["O", "O", "O", "O", "O"], 0, true],
    [["O", "O", "O", "O", "O", "O"], 0, true],
    [["O", "O", "O", "O", "O", "X"], 0, false],
    [["O", "O", "O", "O", "O", "O", "X"], 0, false],
    [[null, null, null, "O", "O", "O", "O", "O"], 4, true],
    [[null, null, null, "O", "O", "O", "O", "O", "O"], 3, true],
    [[null, null, "X", "O", "O", "O", "O", "O", "X"], 3, false],
    [[null, null, "X", "O", "O", "O", "O", "O", "O", "X"], 3, false],
    [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "O",
        "O",
        "O",
        "O",
        "O",
      ],
      19,
      true,
    ],
    [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
      ],
      19,
      true,
    ],
    [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "X",
        "O",
        "O",
        "O",
        "O",
        "O",
      ],
      19,
      false,
    ],
    [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "X",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
      ],
      19,
      false,
    ],
  ];

  var board, col, test_case, values, last_move, expect_result, i, j;
  //check column
  for (i = 0; i < test_cases.length; i++) {
    board = new Array(400).fill(null);
    col = 0;
    test_case = test_cases[i];
    values = test_case[0];
    last_move = test_case[1] * 20;
    expect_result = test_case[2];

    for (j = 0; j < values.length; j++) {
      board[col] = values[j];
      col += 20;
    }

    const result = caroCalculateWinner(board, last_move);

    console.log(expect_result, result);
    if (result === expect_result) {
      console.log("✔️ Test Column", i + 1, "pass");
    } else {
      console.log("❌ Test Column", i + 1, "fail");
    }
  }

  //check row
  for (i = 0; i < test_cases.length; i++) {
    board = new Array(400).fill(null);
    col = 0;
    test_case = test_cases[i];
    values = test_case[0];
    last_move = test_case[1];
    expect_result = test_case[2];

    for (j = 0; j < values.length; j++) {
      board[col] = values[j];
      col += 1;
    }

    const result = caroCalculateWinner(board, last_move);

    console.log(expect_result, result);
    if (result === expect_result) {
      console.log("✔️ Test Row", i + 1, "pass");
    } else {
      console.log("❌ Test Row", i + 1, "fail");
    }
  }

  //check left-right
  for (i = 0; i < test_cases.length; i++) {
    board = new Array(400).fill(null);
    col = 0;
    test_case = test_cases[i];
    values = test_case[0];
    last_move = test_case[1];
    if (last_move !== 0) {
      last_move = last_move * 20 + last_move;
    }

    expect_result = test_case[2];

    for (j = 0; j < values.length; j++) {
      board[col] = values[j];
      col += 21;
    }

    const result = caroCalculateWinner(board, last_move);

    console.log(expect_result, result);
    if (result === expect_result) {
      console.log("✔️ Test left-right", i + 1, "pass");
    } else {
      console.log("❌ Test left-right", i + 1, "fail");
    }
  }
}

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

  test_action();

  return (
    <div className="caroContainer">
      <Board squares={board} onClick={handleClick} />
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

function caroCalculateWinner(board, last_move) {
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

  console.log("##############################");
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

  while (row > 0 && newBoard[row][init_col] === piece) {
    count += 1;
    row = row - 1;
    last1 = row;
  }

  row = init_row + 1;
  while (row < 20 && newBoard[row][init_col] === piece) {
    count += 1;
    row = row + 1;
    last2 = row;
  }

  if (count >= 5) {
    if (init_row === 0 && newBoard[last2][init_col] === null) {
      console.log("column1");
      return true;
    } else if (init_row === 19 && newBoard[last1][init_col] === null) {
      console.log("column2");
      return true;
    } else {
      if (
        newBoard[last1][init_col] === null ||
        newBoard[last2][init_col] === null
      ) {
        console.log("column3");
        return true;
      }
    }
  }

  //check row
  count = 1;
  last1 = init_col;
  last2 = init_col;

  col = init_col - 1;
  while (col > 0 && newBoard[init_row][col] === piece) {
    count += 1;
    col = col - 1;
    last1 = col;
  }

  col = init_col + 1;
  while (col < 20 && newBoard[init_row][col] === piece) {
    count += 1;
    col = col + 1;
    last2 = col;
  }

  if (count >= 5) {
    if (init_col === 0 && newBoard[init_row][last2] === null) {
      console.log("column1");
      return true;
    } else if (init_col === 19 && newBoard[init_row][last1] === null) {
      console.log("column2");
      return true;
    } else {
      if (
        newBoard[init_row][last1] === null ||
        newBoard[init_row][last2] === null
      ) {
        console.log("column3");
        return true;
      }
    }
  }

  var last1_row, last1_col, last2_row, last2_col;
  //check cross left-right
  count = 1;
  last1_row = init_row - 1;
  last1_col = init_col - 1;
  last2_row = init_row + 1;
  last2_col = init_col + 1;

  col = init_col - 1;
  row = init_row - 1;
  while (col > 0 && row > 0 && newBoard[row][col] === piece) {
    count += 1;
    col = col - 1;
    row = row - 1;
    last1_row = row;
    last1_col = col;
  }

  col = init_col + 1;
  row = init_row + 1;
  while (col < 20 && row < 20 && newBoard[row][col] === piece) {
    count += 1;
    col = col + 1;
    row = row + 1;
    last2_row = row;
    last2_col = col;
  }

  console.log(
    "(",
    init_row,
    ",",
    init_col,
    ") ; count: ",
    count,
    "; last1:",
    last1,
    "; last2:",
    last2,
    "; piece:",
    piece
  );

  if (count >= 5) {
    if (init_col === 0 && last2_row > 20) {
      console.log("left-right1");
      return true;
    }
  }

  //check cross right-left

  return false;
}
