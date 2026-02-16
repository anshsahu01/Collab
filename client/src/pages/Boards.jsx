import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";
import { Avatar, AvatarFallback } from "../components/avatar";

import { Plus, LogOut } from "lucide-react";

export default function Boards() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch {
        navigate("/");
      }
    };

    fetchUser();
  }, []);

  // Fetch boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await API.get("/boards");
        setBoards(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // Create board
  const handleCreateBoard = async () => {
    const title = newBoardName.trim();

    if (!title) return;

    try {
      const res = await API.post("/boards", { title });

      setBoards((prev) => [res.data, ...prev]);
      setNewBoardName("");
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Loading boards...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">
                T
              </span>
            </div>

            <h1 className="text-2xl font-bold">
              TaskFlow
            </h1>
          </div>

          {/* User */}
          {user && (
            <div className="flex items-center gap-4">

              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>

            </div>
          )}

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Create Board */}
        <div className="mb-12">

          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
            Create New Board
          </h2>

          <div className="flex gap-3 max-w-xl">

            <Input
              placeholder="Enter board name..."
              value={newBoardName}
              onChange={(e) =>
                setNewBoardName(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleCreateBoard()
              }
            />

            <Button onClick={handleCreateBoard}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>

          </div>

        </div>

        {/* Boards */}
        <div>

          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-6">
            Your Boards
          </h2>

          {boards.length === 0 ? (
            <p className="text-muted-foreground">
              No boards yet. Create your first board.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {boards.map((board) => (

                <Card
                  key={board._id}
                  onClick={() =>
                    navigate(`/boards/${board._id}`)
                  }
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                >

                  <div className="p-6">

                    <h3 className="font-semibold mb-2">
                      {board.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Click to open board
                    </p>

                  </div>

                </Card>

              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}



















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function Boards() {
//     const [loading, setLoading] = useState(true);
//   const [boards, setBoards] = useState([]);
//   const [title, setTitle] = useState("");
//   const navigate = useNavigate();

// useEffect(() => {
//   let isMounted = true;

//   // Define the async function inside useEffect
//   const fetchBoards = async () => {
//     try {
//       const res = await API.get("/boards");
//       if (isMounted) {
//         setBoards(res.data);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Failed to fetch boards. Please try again later.");
//     } finally {
//       if (isMounted) setLoading(false);
//     }
//   };

//   fetchBoards();
//   return () => {
//     isMounted = false;
//   };
// }, []);

//   const createBoard = async () => {
//     if (!title.trim()) return;


//     try {
//       const res = await API.post("/boards", { title });
//       setBoards((prev) => [...prev, res.data]);
//       setTitle("");
//     } catch (error) {
//       alert("Failed to create board");
//       console.log(error);
//     }
//   };
//   if (loading) {
//   return <div style={{ padding: 20 }}>Loading boards...</div>;
// }

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Your Boards</h2>

//       <input
//         placeholder="Board title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <button onClick={createBoard}>
//         Create
//       </button>

//       <hr />

//       {boards.map((board) => (
//         <div
//           key={board._id}
//           style={{
//             border: "1px solid black",
//             padding: 10,
//             margin: 10,
//             cursor: "pointer",
//           }}
//           onClick={() => navigate(`/boards/${board._id}`)}
//         >
//           {board.title}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Boards;
