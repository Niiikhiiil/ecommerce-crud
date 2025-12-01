import { Lock, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }
    const ok = onLogin({ username: username.trim(), password });
    if (ok) navigate("/products");
    else setError("Invalid credentials — make sure you signed up");
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none text-gray-700"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-gray-700"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
