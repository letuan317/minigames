import React, { useState } from "react";
import { BsPersonSquare } from "react-icons/bs";

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
// eslint-disable-next-line
function test_action() {
  console.log("Testing");

  const test_cases = [
    [["O", "O", "O", "O", "O"], 0, true],
    [["O", "O", "O", "O", "O", "O"], 1, true],
    [["O", "O", "O", "O", "O", "X"], 2, true],
    [["O", "O", "O", "O", "O", "O", "X"], 0, true],
    [[null, null, null, "O", "O", "O", "O", "O"], 3, true],
    [[null, null, null, "O", "O", "O", "O", "O", "O"], 4, true],
    [[null, null, "X", "O", "O", "O", "O", "O", "X"], 5, false],
    [[null, null, "X", "O", "O", "O", "O", "O", "O", "X"], 6, false],
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
      18,
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
      17,
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
        "X",
        "O",
        "O",
        "O",
        "O",
        "O",
        "O",
      ],
      16,
      true,
    ],
  ];

  var board, col, test_case, values, last_move, expect_result, i, j;

  console.log("%cChecking COLUMN", "color:DodgerBlue;font-weight:bold;");
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
      console.log(
        "✔️ %cTest Column PASS",
        "color:green;font-weight:bold;",
        i + 1
      );
    } else {
      console.log(
        "❌ %cTest Column FAIL",
        "color:red;font-weight:bold;",
        i + 1
      );
    }
  }

  console.log("%cChecking ROW", "color:DodgerBlue;font-weight:bold;");
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
      console.log("✔️ %cTest Row PASS", "color:green;font-weight:bold;", i + 1);
    } else {
      console.log("❌ %cTest Row FAIL", "color:red;font-weight:bold;", i + 1);
    }
  }

  console.log(
    "%cChecking CROSS left-right",
    "color:DodgerBlue;font-weight:bold;"
  );
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
      console.log(
        "✔️ %cTest Cross left-right PASS",
        "color:green;font-weight:bold;",
        i + 1
      );
    } else {
      console.log(
        "❌ %cTest Cross left-right FAIL",
        "color:red;font-weight:bold;",
        i + 1
      );
    }
  }

  console.log(
    "%cChecking CROSS right-left",
    "color:DodgerBlue;font-weight:bold;"
  );
  //check right-left
  for (i = 0; i < test_cases.length; i++) {
    board = new Array(400).fill(null);
    col = 19;
    test_case = test_cases[i];
    values = test_case[0];
    last_move = test_case[1] + 19;
    if (last_move !== 19) {
      last_move = (test_case[1] + 1) * 19;
    }

    expect_result = test_case[2];

    for (j = 0; j < values.length; j++) {
      board[col] = values[j];
      col += 19;
    }

    const result = caroCalculateWinner(board, last_move);

    console.log(expect_result, result);
    if (result === expect_result) {
      console.log(
        "✔️ %cTest Cross right-left PASS",
        "color:green;font-weight:bold;",
        i + 1
      );
    } else {
      console.log(
        "❌ %cTest Cross right-left FAIL",
        "color:red;font-weight:bold;",
        i + 1
      );
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

  //test_action();

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
// eslint-disable-next-line
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
      return true;
    } else if (last2 > 19) {
      console.log("%cColumn2", "color: yellow");
      return true;
    } else {
      if (
        newBoard[last1][init_col] === null ||
        newBoard[last2][init_col] === null
      ) {
        console.log("%cColumn3", "color: yellow");
        return true;
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
      return true;
    } else if (last2 > 19) {
      console.log("%cRow2", "color: yellow");
      return true;
    } else {
      if (
        newBoard[init_row][last1] === null ||
        newBoard[init_row][last2] === null
      ) {
        console.log("%cRow3", "color: yellow");
        return true;
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
      return true;
    } else if (last1_row <= 0) {
      console.log("%cCross-left-right2", "color: yellow");
      return true;
    } else if (last2_row > 19) {
      console.log("%cCross-left-right3", "color: yellow");
      return true;
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-left-right4", "color: yellow");
        return true;
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
      return true;
    } else if (last1_col >= 19) {
      console.log("%cCross-right-left2", "color: yellow");
      return true;
    } else if (last2_row >= 19) {
      console.log("%cCross-right-left3", "color: yellow");
      return true;
    } else if (last2_col <= 0) {
      console.log("%cCross-right-left4", "color: yellow");
      return true;
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-right-left5", "color: yellow");
        return true;
      }
    }
  }

  return false;
}
