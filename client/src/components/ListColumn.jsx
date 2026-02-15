import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../socket/socket";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";



function TaskItem({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: task,
  });

  const style = {
    padding: 8,
    border: "1px solid gray",
    marginBottom: 5,
    cursor: "grab",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
        <div>{task.assignedTo}</div>
        
        {task.assignedTo && (
            <small>
            Assigned : {task.assignedTo.name}
            </small>
        )}
    </div>
  );
}




export default function ListColumn({ list, boardId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const { setNodeRef } = useDroppable({
  id: list._id,
});


  // fetch tasks
 useEffect(() => {
  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${list._id}`);
    setTasks(res.data);
  };

  fetchTasks();

  // realtime: task created
  socket.on("taskCreated", (task) => {
    if (task.listId === list._id) {
      setTasks((prev) => [...prev, task]);
    }
  });

  // realtime: task moved
  socket.on("taskMoved", (task) => {
    // remove from current list if moved away
    setTasks((prev) =>
      prev.filter((t) => t._id !== task._id)
    );

    // add if moved into this list
    if (task.listId === list._id) {
      setTasks((prev) => [...prev, task]);
    }
  });


   socket.on("taskAssigned", (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  });

  return () => {
    socket.off("taskCreated");
    socket.off("taskMoved");
    socket.off("taskAssigned");
  };

}, [list._id]);


  // create task
  const createTask = async () => {
    if (!title.trim()) return;

    const res = await API.post("/tasks", {
      title,
      boardId,
      listId: list._id,
    });

    setTasks((prev) => [...prev, res.data]);
    setTitle("");
  };

  return (
    <div
       ref={setNodeRef}
      style={{
        minWidth: 250,
        border: "1px solid black",
        padding: 10,
      }}
    >
      <h4>{list.title}</h4>

      {/* tasks */}
      {tasks.map((task) => (
  <TaskItem key={task._id} task={task} />
))}


      {/* create task */}
      <input
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createTask}>
        Add
      </button>
    </div>
  );
}
