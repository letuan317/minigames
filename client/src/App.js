import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React from "react";
import { socket } from "socketio";

import { ChatHomepage, ChatAppmain } from "chat/home";
import { CaroHomepage, CaroAppmain } from "caro/home";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <CaroHomepage socket={socket} />
          </Route>
          <Route path="/caro/:room/:username" component={CaroAppmain} />
          <Route path="/chat" exact>
            <ChatHomepage socket={socket} />
          </Route>
          <Route path="/chat/:roomname/:username" component={ChatAppmain} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
