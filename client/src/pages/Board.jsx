import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

import API from "../api/axios";
import { socket } from "../socket/socket";

import ListColumn from "../components/ListColumn";
import BoardActivityPanel from "../components/BoardActivityPanel";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";

import { ChevronLeft } from "lucide-react";


function Board() {

  const navigate = useNavigate();
  const { id: boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState("");

  // join realtime
  useEffect(() => {

    socket.emit("joinBoard", boardId);

    return () => {
      socket.emit("leaveBoard", boardId);
    };

  }, [boardId]);

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

  useEffect(() => {
    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const res = await API.get(`/activities/${boardId}?page=1&limit=20`);
        setActivities(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [boardId]);

  useEffect(() => {
    const handleActivityCreated = (activity) => {
      if (String(activity.boardId) !== String(boardId)) return;

      setActivities((prev) => {
        const withoutDuplicate = prev.filter((item) => item._id !== activity._id);
        return [activity, ...withoutDuplicate].slice(0, 20);
      });
    };

    socket.on("activityCreated", handleActivityCreated);

    return () => {
      socket.off("activityCreated", handleActivityCreated);
    };
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


  // drag drop
  const handleDragEnd = async (event) => {

    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const sourceListId = active.data?.current?.listId;
    const newListId = String(over.id);

    if (!taskId || !newListId || sourceListId === newListId)
      return;

    try {

      await API.put("/tasks/move", {
        taskId,
        newListId,
        newPosition: 0,
      });

    } catch (err) {
      console.error(err);
    }
  };


  if (loading)
    return (
      <div className="min-h-screen bg-background p-6 text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground tracking-wide">Loading board...</p>
      </div>
    );


  return (

    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1700px] flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/boards")}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Workspace Board
              </p>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                Board
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/my-tasks")}
            >
              My Tasks
            </Button>

            <div className="text-right space-y-1">
              <p className="text-xs text-muted-foreground">
                {lists.length} {lists.length === 1 ? "list" : "lists"}
              </p>
            </div>
          </div>
        </div>
      </header>


      <main className="mx-auto w-full max-w-[1700px] flex flex-col lg:flex-row gap-6 px-6 py-6">
        <section className="relative flex-1 min-w-0 overflow-x-auto hide-scrollbar">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
          <DndContext onDragEnd={handleDragEnd}>
            <div className="relative z-20 inline-flex min-w-full gap-6 pb-1">
              <div className="w-80 flex-shrink-0">
                <Card className="h-full border-dashed border-border/80 bg-card/70 p-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">Create a new list</h3>
                      <p className="text-xs text-muted-foreground">Use short, clear titles for faster scanning.</p>
                    </div>

                    <Input
                      placeholder="List name..."
                      value={newListTitle}
                      onChange={(e) =>
                        setNewListTitle(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && createList()
                      }
                      className="bg-secondary/70 text-sm"
                    />

                    <Button
                      onClick={createList}
                      className="h-9 w-full text-sm font-semibold"
                    >
                      Add List
                    </Button>
                  </div>
                </Card>
              </div>

              {lists.map((list) => (
                <ListColumn
                  key={list._id}
                  list={list}
                  boardId={boardId}
                />
              ))}
            </div>
          </DndContext>
        </section>

        <BoardActivityPanel activities={activities} loading={activitiesLoading} />
      </main>

    </div>

  );
}

export default Board;
