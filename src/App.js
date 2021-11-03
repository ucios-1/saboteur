import { Routes, Route } from "react-router-dom";
import './App.css';
import Games from "./components/Games.jsx";
import About from "./components/About.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Games />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
