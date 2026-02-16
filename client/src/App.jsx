
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from './pages/Signup.jsx';
import Login from "./pages/Login.jsx";
import Boards from "./pages/Boards.jsx";
import Board from "./pages/Board.jsx";
import MyTasks from './pages/Mytasks.jsx';
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<Board />} />
        <Route path="/my-tasks" element={<MyTasks />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
