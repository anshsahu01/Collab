
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Boards from "./pages/Boards.jsx";
import Board from "./pages/Board.jsx";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<Board />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
