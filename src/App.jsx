import {
  Route,
  Routes,
  BrowserRouter as Router,
  Link,
  useNavigate,
} from "react-router-dom";
import useLocalStorageState from "./hooks/useLocalStorageState";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import ProductsPage from "./pages/ProductsPage";
import { toast, ToastContainer } from "react-toastify";

export default function App() {
  const [users, setUsers] = useLocalStorageState("users", []);
  const [authUser, setAuthUser] = useLocalStorageState("authUser", null);

  function handleSignup({ username, email, password }) {
    const exists = users.find(
      (u) => u.username === username || u.email === email
    );
    if (exists) {
      toast.error("User with that username or email already exists");
      return;
    }
    const newUser = { username, email, password };
    setUsers([newUser, ...users]);
    setAuthUser(username);
  }

  function handleLogin({ username, password }) {
    const u = users.find(
      (x) => x.username === username && x.password === password
    );
    if (u) {
      setAuthUser(u.username);
      return true;
    }
    return false;
  }

  function handleLogout() {
    setAuthUser(null);
    toast.success("Logged out successfully.");
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#6086b8] ">
        <ToastContainer position="top-right" autoClose={3000} />

        <Navbar authUser={authUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Landing authUser={authUser} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/products"
            element={
              <RequireAuth authUser={authUser}>
                <ProductsPage />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <div className="p-8">
                Page not found — <Link to="/">Go home</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
