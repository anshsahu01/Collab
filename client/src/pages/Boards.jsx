import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Boards() {
    const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  let isMounted = true;

  // Define the async function inside useEffect
  const fetchBoards = async () => {
    try {
      const res = await API.get("/boards");
      if (isMounted) {
        setBoards(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch boards. Please try again later.");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchBoards();
  return () => {
    isMounted = false;
  };
}, []);

  const createBoard = async () => {
    if (!title.trim()) return;


    try {
      const res = await API.post("/boards", { title });
      setBoards((prev) => [...prev, res.data]);
      setTitle("");
    } catch (error) {
      alert("Failed to create board");
      console.log(error);
    }
  };
  if (loading) {
  return <div style={{ padding: 20 }}>Loading boards...</div>;
}

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Boards</h2>

      <input
        placeholder="Board title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createBoard}>
        Create
      </button>

      <hr />

      {boards.map((board) => (
        <div
          key={board._id}
          style={{
            border: "1px solid black",
            padding: 10,
            margin: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/boards/${board._id}`)}
        >
          {board.title}
        </div>
      ))}
    </div>
  );
}

export default Boards;
