import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import API from "../api/axios";
import { socket } from "../socket/socket";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Avatar, AvatarFallback } from "../components/avatar";

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }

    const handleMyTasksRefresh = () => {
      fetchTasks();
    };

    socket.on("myTasksRefresh", handleMyTasksRefresh);

    return () => {
      socket.off("myTasksRefresh", handleMyTasksRefresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/boards")}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">My Tasks</h1>
            <p className="text-xs text-muted-foreground">Tasks assigned to you</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-4">
        {tasks.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No tasks assigned yet.
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task._id}
              className="p-5 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{task.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    Board:{" "}
                    <span className="text-foreground font-medium">
                      {task.boardId?.title}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    List:{" "}
                    <span className="text-foreground font-medium">
                      {task.listId?.title}
                    </span>
                  </div>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {task.assignedTo?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
