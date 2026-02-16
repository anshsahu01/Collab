import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../api/axios";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/boards");

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">

      <Card className="w-full max-w-md p-8 space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">

          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">
              T
            </span>
          </div>

          <h1 className="text-2xl font-bold">
            TaskFlow
          </h1>

          <p className="text-muted-foreground text-sm">
            Login to your workspace
          </p>

        </div>

        {/* Form */}
        <div className="space-y-4">

          <div>
            <label className="text-sm text-muted-foreground">
              Email
            </label>

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Password
            </label>

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            onClick={handleLogin}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </div>

        {/* Signup link */}
        <p className="text-sm text-center text-muted-foreground">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-primary hover:underline"
          >
            Signup
          </Link>

        </p>

      </Card>

    </div>
  );
}









// import React from 'react'
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// function Login() {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();


//     const handleLogin = async () => {
//         try {

//             const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

      
//       localStorage.setItem("token", res.data.token);
//       navigate("/boards");

            
//         } catch (error) {
//             alert("Login failed");
//             return;
            
//         }
//     }

//   return (
//     <div style={{ padding: 40 }}>
//       <h2>Login</h2>

//       <input
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <br /><br />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <br /><br />
//       <button onClick={() => navigate("/signup")}>
//      Create account
//     </button>

//       <button onClick={handleLogin}>
//         Login
//       </button>
//     </div>
//   )
// }

// export default Login
