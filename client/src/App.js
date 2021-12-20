import { Routes, Route } from "react-router-dom";
import './App.css';
import Games from "./components/Games.jsx";
import GamesList from "./components/GamesList.jsx";
import NewGame from "./components/NewGame.jsx";
import TheGame from "./components/TheGame.jsx";
import io from "socket.io-client";

// I'm not shure if I need statick player ID... 
/*
const socket = io.connect("http://localhost:4000", {query: { id: "test" }});
*/
// heroku server
const socket = io.connect("https://whispering-depths-44692.herokuapp.com/");
// local sever
// const socket = io.connect("http://localhost:4000");

function App() {

  return (
    <Routes>
      <Route path="/" element={<Games />} />
      <Route path="/saboteur/:version" element={<GamesList socket={ socket } />} />
      <Route path="/saboteur/:version/new%20game" element={<NewGame socket={ socket } />} />
      <Route path="/saboteur/:version/game/:gameID/player/:player" element={<TheGame socket={ socket } />} />
    </Routes>
  );
}

export default App;
