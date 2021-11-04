import { Routes, Route } from "react-router-dom";
import './App.css';
import Games from "./components/Games.jsx";
import GamesList from "./components/GamesList.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Games />} />
      <Route path="/saboteur/1" element={<GamesList />} />
      <Route path="/saboteur/2" element={<GamesList />} />
    </Routes>
  );
}

export default App;
