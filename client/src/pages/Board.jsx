import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import API from '../api/axios';
import { socket } from '../socket/socket';
import ListColumn from "../components/ListColumn";




function Board() {

    const { id: boardId } = useParams();

    const [lists, setLists] = useState([]);
    const [loading,setLoading] = useState(true);
    const [newListTitle, setNewListTitle] = useState("");




    // join realtime room
    useEffect(() => {
        socket.emit("joinBoard", boardId);

        return () => {
            socket.emit("leaveBoard", boardId);
        }
    },[boardId]);


      // fetch lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await API.get(`/lists/${boardId}`);
        setLists(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [boardId]);


  // create list
  const createList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const res = await API.post("/lists", {
        title: newListTitle,
        boardId,
      });

      setLists((prev) => [...prev, res.data]);
      setNewListTitle("");
    } catch (err) {
      console.error(err);
    }
  };



  const handleDragEnd = async (event) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const newListId = over.id;

  await API.put("/tasks/move", {
    taskId,
    newListId,
    newPosition: 0,
  });
};



  if (loading) return <div>Loading board...</div>;
  return (
     <div style={{ padding: 20 }}>
      <h2>Board</h2>

      {/* Create list */}
      <input
        placeholder="New list title"
        value={newListTitle}
        onChange={(e) => setNewListTitle(e.target.value)}
      />

      <button onClick={createList}>
        Add List
      </button>

      {/* Lists */}
      <DndContext onDragEnd={handleDragEnd}>
      <div style={{
  display: "flex",
  gap: 20,
  marginTop: 20,
  overflowX: "auto"
}}>
  {lists.map((list) => (
    <ListColumn
      key={list._id}
      list={list}
      boardId={boardId}
    />
  ))}
</div>
</DndContext>

    </div>
  )
}

export default Board
