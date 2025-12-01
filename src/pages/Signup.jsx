import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!username.trim()) e.username = "Username is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Valid email required";
    if (password.length < 6) e.password = "Password must be at least 6 chars";
    if (password !== confirm) e.confirm = "Passwords do not match";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSignup({ username: username.trim(), email: email.trim(), password });
    alert("Sign up successful — you are logged in");
    navigate("/products");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
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
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-gray-700"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-gray-700"
              placeholder="Create a password"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Confirm Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full outline-none text-gray-700"
              placeholder="Re-enter password"
            />
          </div>
          {errors.confirm && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
          )}
        </div>

        <button className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
