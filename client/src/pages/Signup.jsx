import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/boards");
    } catch (err) {
        console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSignup}>
        Signup
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        Go to Login
      </button>
    </div>
  );
}
