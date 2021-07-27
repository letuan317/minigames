import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import "./home.scss";
import Game from "caro/game";
import { socket } from "socketio";

export function CaroHomepage({ socket }) {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const [redirctTo, setRedirctTo] = useState(false);
  const [message, setMessages] = useState("");

  const action_create_new_room = () => {
    if (username !== "") {
      socket.emit("caro_create_new_room", username);
    } else {
      alert("username is not empty!");
      //window.location.reload();
    }
  };

  const action_join = () => {
    console.log(username, roomID);
    if (username !== "" && roomID !== "") {
      socket.emit("caro_join_room", { roomID, username });
    } else {
      alert("username and room are must !");
      //window.location.reload();
    }
  };

  useEffect(() => {
    socket.on("caro_created_new_room", (data) => {
      console.log("caro_created_new_room", data.roomID, data.username);
      if (data.username === username) {
        setRoomID(data.roomID);
        setRedirctTo(true);
      }
    });

    socket.on("caro_joined_room", (data) => {
      console.log("caro_joined_room", data.roomID, data.username);
      if (data.username === username) {
        setRoomID(data.roomID);
        setRedirctTo(true);
      }
    });

    socket.on("error_message", (message) => {
      setMessages(message);
    });
  });

  if (redirctTo) {
    return <Redirect to={`/caro/${roomID}/${username}`} />;
  } else {
    return (
      <div className="carohomepage">
        <h1>Welcome to Caro Game</h1>
        {message ? "" + message : ""}
        <input
          placeholder="Input your user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <button onClick={action_create_new_room}>New Room</button>

        <input
          placeholder="Input the room name"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
        ></input>
        <button onClick={action_join}>Join</button>
      </div>
    );
  }
}

export function CaroAppmain(props) {
  return (
    <React.Fragment>
      <div className="caroContainer">
        <Game
          socket={socket}
          roomID={props.match.params.room}
          username={props.match.params.username}
        />
      </div>
    </React.Fragment>
  );
}
