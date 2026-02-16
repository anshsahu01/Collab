import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

import API from "../api/axios";
import { socket } from "../socket/socket";

import ListColumn from "../components/ListColumn";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";

import { ChevronLeft, Plus } from "lucide-react";


function Board() {

  const navigate = useNavigate();
  const { id: boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="min-h-screen bg-background p-6 text-foreground">
        Loading board...
      </div>
    );


  return (

    <div className="min-h-screen bg-background">

      {/* Header */}
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
            <h2 className="text-xl font-bold text-foreground">
              Board
            </h2>

            <p className="text-xs text-muted-foreground">
              ID: {boardId}
            </p>
          </div>

        </div>

      </header>


      {/* Lists */}
      <main className="overflow-x-auto">

        <DndContext onDragEnd={handleDragEnd}>

          <div className="inline-flex min-w-full gap-6 p-6">

            {lists.map((list) => (

              <ListColumn
                key={list._id}
                list={list}
                boardId={boardId}
              />

            ))}


            {/* Add list */}
            <div className="w-80 flex-shrink-0">

              <Card className="h-full border-dashed p-4">

                <div className="space-y-3">

                  <Input
                    placeholder="List name..."
                    value={newListTitle}
                    onChange={(e) =>
                      setNewListTitle(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && createList()
                    }
                    className="bg-secondary"
                  />

                  <Button
                    onClick={createList}
                    className="h-9 w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add List
                  </Button>

                </div>

              </Card>

            </div>

          </div>

        </DndContext>

      </main>

    </div>

  );
}

export default Board;
