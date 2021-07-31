export function test_action() {
  console.log("Testing");

  const test_cases = [
    [["O", "O", "O", "O", "O"], 0, true],
    [["O", "O", "O", "O", "O", "O"], 1, true],
    [["O", "O", "O", "O", "O", "X"], 2, true],
    [["O", "O", "O", "O", "O", "O", "X"], 0, true],
    [[null, null, null, "O", "O", "O", "O", "O"], 3, true],
    [[null, null, null, "O", "O", "O", "O", "O", "O"], 4, true],
    [[null, null, null, "O", "O", "O", "O", "O", "O", "X"], 4, true],
    [[null, null, null, "X", "O", "O", "O", "O", "O", "O"], 4, true],
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

    const result = caroCalculateWinner5(board, last_move);

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

    const result = caroCalculateWinner5(board, last_move);

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

    const result = caroCalculateWinner5(board, last_move);

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

    const result = caroCalculateWinner5(board, last_move);

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

// eslint-disable-next-line
export function calculateWinner(squares) {
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

export function caroCalculateWinner(board, last_move) {
  // for test
  //const return_true = true;
  //const return_false = false;

  const return_true = board[last_move];
  const return_false = null;

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

  if (last1 === 0) {
    last1 = -1;
  }
  if (last2 === 19) {
    last2 = 20;
  }
  if (last1 > 0 && newBoard[last1][init_col] === piece) {
    last1 = last1 - 1;
  }
  if (last2 < 19 && newBoard[last2][init_col] === piece) {
    last1 = last1 + 1;
  }

  if (count >= 5) {
    console.log(
      "%cCheck COLUMN",
      "color:yellow",
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
      return return_true;
    } else if (last2 > 19) {
      console.log("%cColumn2", "color: yellow");
      return return_true;
    } else {
      if (
        newBoard[last1][init_col] === null ||
        newBoard[last2][init_col] === null
      ) {
        console.log("%cColumn3", "color: yellow");
        return return_true;
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

  if (last1 === 0) {
    last1 = -1;
  }
  if (last2 === 19) {
    last2 = 20;
  }
  if (last1 > 0 && newBoard[init_row][last1] === piece) {
    last1 = last1 - 1;
  }
  if (last2 < 19 && newBoard[init_row][last2] === piece) {
    last2 = last2 + 1;
  }

  if (count >= 5) {
    console.log(
      "%cCheck ROW",
      "color:yellow",
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
      return return_true;
    } else if (last2 > 19) {
      console.log("%cRow2", "color: yellow");
      return return_true;
    } else {
      if (
        newBoard[init_row][last1] === null ||
        newBoard[init_row][last2] === null
      ) {
        console.log("%cRow3", "color: yellow");
        return return_true;
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
  if (last1_row !== last2_row && last1_col !== last2_col) {
    if (last1_row === 0 && last1_col === 0) {
      last1_row = -1;
      last1_col = -1;
    } else if (last1_row === 0 && last1_col !== 0) {
      last1_row = -1;
      last1_col -= 1;
    } else if (last1_row !== 0 && last1_col === 0) {
      last1_row -= 1;
      last1_col = -1;
    }

    if (last2_row === 0 && last2_col === 0) {
      last2_row = -1;
      last2_col = -1;
    } else if (last2_row === 0 && last2_col !== 0) {
      last2_row = -1;
      last2_col -= 1;
    } else if (last2_row !== 0 && last2_col === 0) {
      last2_row -= 1;
      last2_col = -1;
    }

    if (
      last1_row > 0 &&
      last1_col > 0 &&
      newBoard[last1_row][last1_col] === piece
    ) {
      last1_row -= 1;
      last1_col -= 1;
    }

    if (
      last2_row < 19 &&
      last2_col < 19 &&
      newBoard[last2_row][last2_col] === piece
    ) {
      last2_row += 1;
      last2_col += 1;
    }
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
      return return_true;
    } else if (last1_row <= 0) {
      console.log("%cCross-left-right2", "color: yellow");
      return return_true;
    } else if (last2_row > 19) {
      console.log("%cCross-left-right3", "color: yellow");
      return return_true;
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-left-right4", "color: yellow");
        return return_true;
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

  if (last1_row !== last2_row && last1_col !== last2_col) {
    if (last1_row === 0 && last1_col === 19) {
      last1_row = -1;
      last1_col = 20;
    } else if (last1_row === 0 && last1_col !== 19) {
      last1_row = -1;
      last1_col += 1;
    } else if (last1_row !== 0 && last1_col === 19) {
      last1_row -= 1;
      last1_col = 20;
    }

    if (last2_row === 0 && last2_col === 19) {
      last2_row = -1;
      last2_col = 20;
    } else if (last2_row === 0 && last2_col !== 19) {
      last2_row = -1;
      last2_col += 1;
    } else if (last2_row !== 0 && last2_col === 19) {
      last2_row -= 1;
      last2_col = 20;
    }

    if (
      last1_row > 0 &&
      last1_col < 19 &&
      newBoard[last1_row][last1_col] === piece
    ) {
      last1_row -= 1;
      last1_col += 1;
    }

    if (
      last2_row < 19 &&
      last2_col > 0 &&
      newBoard[last2_row][last2_col] === piece
    ) {
      last2_row += 1;
      last2_col -= 1;
    }
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
      return return_true;
    } else if (last1_col >= 19) {
      console.log("%cCross-right-left2", "color: yellow");
      return return_true;
    } else if (last2_row >= 19) {
      console.log("%cCross-right-left3", "color: yellow");
      return return_true;
    } else if (last2_col <= 0) {
      console.log("%cCross-right-left4", "color: yellow");
      return return_true;
    } else {
      if (
        newBoard[last1_row][last1_col] === null ||
        newBoard[last2_row][last2_col] === null
      ) {
        console.log("%cCross-right-left5", "color: yellow");
        return return_true;
      }
    }
  }

  return return_false;
}

// rule 5:
export function caroCalculateWinner5(board, last_move) {
  // for test
  //const return_true = true;
  //const return_false = false;

  const return_true = board[last_move];
  const return_false = null;

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
      "%cCheck COLUMN",
      "color:yellow",
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
    return return_true;
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
      "%cCheck ROW",
      "color:yellow",
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
    return return_true;
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
    return return_true;
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
    return return_true;
  }

  return return_false;
}
