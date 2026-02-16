import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../socket/socket";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { Card } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";

import { Plus } from "lucide-react";

export default function ListColumn({ list, boardId }) {

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: list._id,
  });

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await API.get("/auth/users");
      setUsers(res.data);
      console.log("Users:", res.data);
    };

    fetchUsers();
  }, []);

  // fetch tasks + realtime
  useEffect(() => {

    const fetchTasks = async () => {
      const res = await API.get(`/tasks/${list._id}`);
      setTasks(res.data);
    };

    fetchTasks();

    const handleTaskCreated = (task) => {
      if (String(task.listId) === String(list._id)) {
        setTasks((prev) => [...prev, task]);
      }
    };

    const handleTaskMoved = (task) => {

      setTasks((prev) =>
        prev.filter((t) => t._id !== task._id)
      );

      if (String(task.listId) === String(list._id)) {
        setTasks((prev) => [...prev, task]);
      }
    };

    const handleTaskAssigned = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        )
      );
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskMoved", handleTaskMoved);
    socket.on("taskAssigned", handleTaskAssigned);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskMoved", handleTaskMoved);
      socket.off("taskAssigned", handleTaskAssigned);
    };

  }, [list._id]);

  // assign task function (FIXED POSITION)
  const assignTask = async (taskId, userId) => {
    try {
      const res = await API.put("/tasks/assign", { taskId, userId });
      const updatedTask = res.data;

      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        )
      );
    } catch (err) {
      console.error("Failed to assign task:", err);
    }
  };

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
    <div ref={setNodeRef} className="w-80 flex-shrink-0">

      <Card className="flex flex-col h-full">

        {/* header */}
        <div className="p-4 border-b border-border">

          <h2 className="font-semibold text-foreground">
            {list.title}
          </h2>

          <p className="text-xs text-muted-foreground">
            {tasks.length} tasks
          </p>

        </div>

        {/* tasks */}
        <div className="flex-1 p-4 space-y-2">

          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              assignTask={assignTask}
              users={users}
            />
          ))}

        </div>

        {/* add task */}
        <div className="p-4 border-t border-border space-y-2">

          <Input
            placeholder="Add task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            size="sm"
            className="w-full"
            onClick={createTask}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>

        </div>

      </Card>

    </div>
  );
}


// Separate TaskItem component (ONLY ONCE)
function TaskItem({ task, assignTask, users }) {

  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task._id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (

    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-secondary cursor-grab p-3 space-y-2 hover:border-primary/40"
    >

      <p className="text-sm font-medium text-foreground">
        {task.title}
      </p>

      <div className="flex items-center justify-between">

        {task.assignedTo ? (
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {task.assignedTo.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-muted-foreground">
            Unassigned
          </span>
        )}

        <select
          value={task.assignedTo?._id || ""}
          onChange={(e) =>
            assignTask(task._id, e.target.value)
          }
          className="bg-background border border-border rounded text-xs px-2 py-1"
        >

          <option value="">Assign</option>

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}

        </select>

      </div>

    </Card>

  );
}
