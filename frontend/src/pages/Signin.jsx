import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://movie-search-platform.onrender.com/api";

export default function Signin() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");
      login(data.user, data.token);
      window.location.href = "/profile";
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      {error && <p className="text-rose-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          className="h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="h-11 rounded-lg bg-slate-900 text-white hover:bg-slate-800">Sign in</button>
      </form>
    </div>
  );
}
