import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../api/axios";

import { Button } from "../components/button";
import { Input } from "../components/input";
import { Card } from "../components/card";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/boards");

    } catch (err) {
      setError("Signup failed. Try different email.");
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
            Create Account
          </h1>

          <p className="text-muted-foreground text-sm">
            Signup to start collaborating
          </p>

        </div>

        {/* Form */}
        <div className="space-y-4">

          <div>
            <label className="text-sm text-muted-foreground">
              Name
            </label>

            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            onClick={handleSignup}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Signup"}
          </Button>

        </div>

        {/* Login link */}
        <p className="text-sm text-center text-muted-foreground">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Login
          </Link>

        </p>

      </Card>

    </div>
  );
}
