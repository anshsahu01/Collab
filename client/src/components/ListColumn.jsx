import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../socket/socket";
import { useDraggable, useDroppable } from "@dnd-kit/core";

import { Card } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";

import { Check, GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";

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
    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? { ...t, ...updatedTask } : t
        )
      );
    };
    const handleTaskDeleted = (deletedTask) => {
      setTasks((prev) =>
        prev.filter((t) => t._id !== deletedTask._id)
      );
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskMoved", handleTaskMoved);
    socket.on("taskAssigned", handleTaskAssigned);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskMoved", handleTaskMoved);
      socket.off("taskAssigned", handleTaskAssigned);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
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

  const updateTask = async (taskId, title) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, { title });
      const updatedTask = res.data;

      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? { ...t, ...updatedTask } : t
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // create task
  const createTask = async () => {

    if (!title.trim()) return;

    await API.post("/tasks", {
      title,
      boardId,
      listId: list._id,
    });
    setTitle("");
  };

  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0">

      <Card className="flex flex-col h-full bg-card/80 border-border/80 backdrop-blur-sm">

        {/* header */}
        <div className="p-4 border-b border-border/80">

          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
            List
          </p>

          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-foreground tracking-tight truncate">
              {list.title}
            </h2>

            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border/70 bg-secondary/60 px-2 text-[11px] text-muted-foreground">
              {tasks.length}
            </span>
          </div>

        </div>

        {/* tasks */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/70 bg-background/30 p-3 text-xs text-muted-foreground">
              No tasks yet. Add one below.
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                assignTask={assignTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                users={users}
              />
            ))
          )}
        </div>

        {/* add task */}
        <div className="p-4 border-t border-border/80 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            New Task
          </p>

          <Input
            placeholder="Add task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary/70 text-sm"
          />

          <Button
            size="sm"
            className="w-full text-sm font-semibold"
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
function TaskItem({ task, assignTask, updateTask, deleteTask, users }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: { listId: task.listId },
    });

  useEffect(() => {
    setEditTitle(task.title);
  }, [task.title]);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: isDragging ? 999 : "auto",
    position: isDragging ? "relative" : "static",
    boxShadow: isDragging
      ? "0 12px 30px rgba(0,0,0,0.35)"
      : undefined,
  };

  const saveEdit = async () => {
    const nextTitle = editTitle.trim();
    if (!nextTitle) return;

    try {
      await updateTask(task._id, nextTitle);
      setIsEditing(false);
    } catch {
      // keep edit mode open on error
    }
  };

  const cancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const confirmDelete = () => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;
    deleteTask(task._id);
  };

  const stopDragCapture = (e) => {
    e.stopPropagation();
  };

  return (

    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-secondary/65 border-border/80 cursor-grab p-3 space-y-2.5 hover:border-primary/40 hover:bg-secondary/80 transition-colors ${
        isDragging ? "border-primary/60" : ""
      }`}
    >

      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            onPointerDown={stopDragCapture}
            className="w-full rounded-md border border-border/80 bg-background/80 px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-foreground leading-snug break-words">
            {task.title}
          </p>
        )}
        <div
          {...listeners}
          {...attributes}
          className="p-1 -m-1 rounded text-muted-foreground/70 hover:text-foreground hover:bg-background/40"
          aria-label="Drag task"
          title="Drag task"
        >
          <GripVertical className="h-4 w-4 flex-shrink-0 mt-0.5" />
        </div>
      </div>

      <div className="flex items-center justify-between">

        {task.assignedTo ? (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[11px]">
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
          onPointerDown={stopDragCapture}
          className="bg-background/80 border border-border/80 rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/60"
        >

          <option value="">Assign</option>

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}

        </select>

      </div>

      <div className="flex items-center justify-end gap-1">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              onPointerDown={stopDragCapture}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 text-emerald-400 hover:bg-background/40"
              aria-label="Save task"
              title="Save"
              type="button"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              onPointerDown={stopDragCapture}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 text-muted-foreground hover:bg-background/40"
              aria-label="Cancel edit"
              title="Cancel"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              onPointerDown={stopDragCapture}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 text-muted-foreground hover:text-foreground hover:bg-background/40"
              aria-label="Edit task"
              title="Edit"
              type="button"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={confirmDelete}
              onPointerDown={stopDragCapture}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 text-red-400 hover:bg-background/40"
              aria-label="Delete task"
              title="Delete"
              type="button"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

    </Card>

  );
}
