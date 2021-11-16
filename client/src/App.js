import { Routes, Route } from "react-router-dom";
import './App.css';
import Games from "./components/Games.jsx";
import GamesList from "./components/GamesList.jsx";
import NewGame from "./components/NewGame.jsx";
import TheGame from "./components/TheGame.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Games />} />
      <Route path="/saboteur/:version" element={<GamesList />} />
      <Route path="/saboteur/:version/new%20game" element={<NewGame />} />
      <Route path="/saboteur/:version/game/undefined" element={<TheGame />} />
    </Routes>
  );
}

export default App;
