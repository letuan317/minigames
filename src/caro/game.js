import React, { useState, useEffect } from "react";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import "reactjs-popup/dist/index.css";

import "./game.scss";
import useSound from "use-sound";

import sound_write from "../assests/sounds/writing-scribble-on-paper.mp3";
import sound_firework from "../assests/sounds/firework.mp3";
import sound_button from "../assests/sounds/arcade-game-jump-coin.mp3";
import sound_notification from "../assests/sounds/retro-arcade-casino-notification.mp3";
import sound_error from "../assests/sounds/computer-error.mp3";
import sound_game_start from "../assests/sounds/medieval-show-fanfare-announcement.mp3";
import sound_game_over from "../assests/sounds/game-over.mp3";
import sound_countdown from "../assests/sounds/countdown.mp3";
import sound_yawn_long from "../assests/sounds/long-yawn.mp3";

import gif_cry from "../assests/images/cry.gif";

import { caroCalculateWinner, caroCalculateWinner5 } from "./utilities";

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
  var checkWinner = "";

  const [gameStatus, setGameStatus] = useState("loading");
  const [piece, setPiece] = useState("");
  const [turn, setTurn] = useState("");
  const [rule, setRule] = useState("rule1");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [points, setPoints] = useState(0);
  const [opponentPlayer, setOpponentPlayer] = useState("");
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [lastMove, setLastMove] = useState(0);
  const [undoRequest, setUndoRequest] = useState(false);
  const [drawRequest, setDrawRequest] = useState(false);
  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState("");

  const [playWrite] = useSound(sound_write);
  const [playFirework] = useSound(sound_firework, { volume: 0.5 });
  const [playButton] = useSound(sound_button);
  const [playNotification] = useSound(sound_notification);
  const [playError] = useSound(sound_error);
  const [playNewGame] = useSound(sound_game_start, { volume: 0.5 });
  const [playGameOver] = useSound(sound_game_over);
  const [playCountDown] = useSound(sound_countdown);
  const [playYawnLong] = useSound(sound_yawn_long);

  if (gameStatus === "loading") {
    console.log("loading");
    socket.emit("caro_game_status", { roomID, username });
  }

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (boardCopy[i] === null) {
      playWrite();
      if (notify) {
        setNotify(false);
      }
      // Put an X or an O in the clicked square
      boardCopy[i] = piece;

      setLastMove(i);

      const last_move = i;
      console.log(i, last_move);
      //setBoard(boardCopy);
      socket.emit("caro_update_board", { roomID, boardCopy, turn, last_move });
      //setXisNext(!xIsNext);
      // If user click an occupied square or if game is won, return
      if (rule === "rule1") {
        checkWinner = caroCalculateWinner5(boardCopy, i);
      } else {
        checkWinner = caroCalculateWinner(boardCopy, i);
      }

      console.log("checkWinner", checkWinner);
      if (checkWinner) {
        console.log("checkWinner", checkWinner);
        socket.emit("caro_check_end_game", { roomID, checkWinner });
        return;
      }
    }
  };

  const handleClickNothing = (i) => {
    playError();
  };

  const newGame = () => {
    playNewGame();
    playButton();
    socket.emit("caro_create_new_game", { roomID, username });
  };
  const undoGame = () => {
    playButton();
    socket.emit("caro_undo_game", { roomID, username });
  };
  const requestundoyes = () => {
    playButton();
    socket.emit("caro_undo_game_comfirmed", { roomID, username });
    setUndoRequest(false);
  };
  const requestundono = () => {
    playButton();
    socket.emit("caro_undo_game_uncomfirmed", { roomID, username });
    setUndoRequest(false);
  };
  const drawGame = () => {
    playButton();
    socket.emit("caro_draw_game", { roomID, username });
  };
  const requestdrawyes = () => {
    playButton();
    socket.emit("caro_create_new_game", { roomID, username });
    setDrawRequest(false);
  };
  const requestdrawno = () => {
    playButton();
    socket.emit("caro_draw_game_uncomfirmed", { roomID, username });
    setDrawRequest(false);
  };
  const notifyClose = () => {
    setNotify(false);
    console.log("clicked");
  };

  const sendEmoji1 = () => {
    const emoji = "countdown";
    socket.emit("caro_send_emoji", { roomID, emoji });
  };

  const sendEmoji2 = () => {
    const emoji = "yawn-long";
    socket.emit("caro_send_emoji", { roomID, emoji });
  };

  useEffect(() => {
    socket.on("caro_game_status", ({ message, players }) => {
      console.log("gameStatus", message);
      setGameStatus(message);
      console.log("%cTest", "color: yellow");
      console.log(players);
      if (players.length === 2) {
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
      setRule(data.rule);
      playNewGame();
    });

    socket.on("caro_update_board", (data) => {
      console.log("caro_update_board", data.lastMove);
      setBoard(data.board);
      setTurn(data.turn);
      setLastMove(data.lastMove);

      if (notify) {
        setNotify(false);
      }
      if (data.turn !== piece) {
        playNotification();
      }
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

      if (data.player_win === username) {
        playFirework();
      } else {
        playGameOver();
      }
    });

    socket.on("caro_request_undo_game", () => {
      setUndoRequest(true);
    });
    socket.on("caro_request_undo_game_comfirmed", (check) => {
      setNotify(true);
      if (check === true) {
        setMessage("Accepted to undo last move");
      } else {
        setMessage("Not accept to undo last move");
      }
      playNotification();
    });
    socket.on("caro_request_draw_game", () => {
      setDrawRequest(true);
    });
    socket.on("caro_request_draw_game_comfirmed", (check) => {
      setNotify(true);
      if (check === true) {
        setMessage("Accepted to undo last move");
      } else {
        setMessage("Not accept to draw last move, continue play");
      }
      playNotification();
    });

    if (turn === piece) {
      setIsYourTurn(true);
    } else {
      setIsYourTurn(false);
    }

    socket.on("caro_emoji", (emoji) => {
      console.log(emoji);
      switch (emoji) {
        case "countdown":
          playCountDown();
          break;
        case "yawn-long":
          playYawnLong();
          break;
        default:
          break;
      }
    });
  }, [
    socket,
    turn,
    piece,
    username,
    board,
    lastMove,
    notify,
    playFirework,
    playNotification,
    playNewGame,
    playGameOver,
    playCountDown,
    playYawnLong,
  ]);

  switch (gameStatus) {
    case "waiting":
      return (
        <>
          <div className="top">
            <div className="player">
              <div className="avatar">
                <AccountBoxIcon />
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
                <h5 style={{ marginLeft: "5px", marginRight: "5px" }}>
                  {rule}
                </h5>
              </div>
              <div className="scoreboard"></div>
            </div>
            <div className="player">
              <div className="avatar">
                <AccountBoxIcon />
              </div>
              <div className="player-name">Waiting...</div>
            </div>
          </div>
          <div className="bottom">
            <h1>Waiting ...</h1>
            <div className="controller">
              <button
                className="button leave"
                onClick={(event) => (window.location.href = "/")}
              >
                Leave
              </button>
            </div>
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
                <AccountBoxIcon />
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
                <h5 style={{ marginLeft: "5px", marginRight: "5px" }}>
                  {rule}
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
                <AccountBoxIcon />
              </div>
              <div className="player-name">{opponentPlayer}</div>
            </div>
          </div>
          <div className="bottom">
            <div className="controller">
              <button className="button start-game" onClick={newGame}>
                New Game
              </button>
              <button
                className="button leave"
                onClick={(event) => (window.location.href = "/")}
              >
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
                <AccountBoxIcon />
              </div>
              {isYourTurn ? (
                <div className="player-name" style={{ color: "coral" }}>
                  {username}
                </div>
              ) : (
                <div className="player-name" style={{ color: "white" }}>
                  {username}
                </div>
              )}
            </div>
            <div className="info">
              <div className="roomid">
                <h5>
                  Room: <b>{roomID}</b>
                </h5>
                <h5 style={{ marginLeft: "5px", marginRight: "5px" }}>
                  {rule}
                </h5>
                <h5>
                  Turn: <b>{isYourTurn ? "You" : opponentPlayer}</b>
                </h5>
              </div>
              <div className="scoreboard">
                {piece === "X" ? (
                  <div className="piece caro-x">X</div>
                ) : (
                  <div className="piece caro-o">O</div>
                )}
                <div className="points">
                  {points} : {opponentPoints}
                </div>

                {piece === "X" ? (
                  <div className="piece caro-o">O</div>
                ) : piece === "O" ? (
                  <div className="piece caro-x">X</div>
                ) : (
                  <div className="piece"></div>
                )}
              </div>
            </div>
            <div className="player">
              <div className="avatar">
                <AccountBoxIcon />
              </div>
              {isYourTurn ? (
                <div className="player-name">{opponentPlayer}</div>
              ) : (
                <div className="player-name" style={{ color: "coral" }}>
                  {opponentPlayer}
                </div>
              )}
            </div>
          </div>
          {undoRequest ? (
            <div class="overlay">
              <div class="popup">
                <p>
                  <i>{opponentPlayer} </i>request undo last move
                </p>
                <div class="controller">
                  <button class="button undo" onClick={requestundono}>
                    NO
                  </button>
                  <button class="button start-game" onClick={requestundoyes}>
                    YES
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {drawRequest ? (
            <div class="overlay">
              <div class="popup">
                <p>
                  {opponentPlayer} request draw this game, and start new game
                </p>
                <div class="controller">
                  <button class="button undo" onClick={requestdrawno}>
                    NO
                  </button>
                  <button class="button start-game" onClick={requestdrawyes}>
                    YES
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {notify ? (
            <div class="alert">
              <button class="closebtn" onclick={notifyClose}>
                &times;
              </button>
              <strong>Message!</strong> {message}
            </div>
          ) : (
            <div></div>
          )}

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
              {isYourTurn ? (
                <div />
              ) : (
                <button className="button undo" onClick={undoGame}>
                  Undo
                </button>
              )}
              <button className="button draw" onClick={drawGame}>
                Draw
              </button>
              <button
                className="button leave"
                onClick={(event) => (window.location.href = "/")}
              >
                Leave
              </button>
            </div>
          </div>
          <div className="bottom">
            <div className="controller">
              <button className="button emoji01" onClick={sendEmoji1}>
                ⏰ CountDown
              </button>
              <button className="button emoji02" onClick={sendEmoji2}>
                🥱 Yawn
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
                <AccountBoxIcon />
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
                <h5 style={{ marginLeft: "5px", marginRight: "5px" }}>
                  {rule}
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
                <AccountBoxIcon />
              </div>
              <div className="player-name">{opponentPlayer}</div>
            </div>
          </div>

          {winner === username ? (
            <div class="pyro">
              <div class="before"></div>
              <Board
                squares={board}
                lastMove={lastMove}
                onClick={handleClickNothing}
              />
              <div class="after"></div>
            </div>
          ) : (
            <div>
              <div className="game-over">
                <img src={gif_cry} alt="game-over" />
              </div>
              <Board
                squares={board}
                lastMove={lastMove}
                onClick={handleClickNothing}
              />
            </div>
          )}

          <div className="bottom">
            <div className="controller">
              <button className="button start-game" onClick={newGame}>
                New Game
              </button>

              <button
                className="button leave"
                onClick={(event) => (window.location.href = "/")}
              >
                Leave
              </button>
            </div>
          </div>
          <audio className="audio-element">
            <source src={sound_firework}></source>
          </audio>
        </>
      );
      // eslint-disable-next-line
      break;
    default:
      return <div>Loading...</div>;
  }
}
