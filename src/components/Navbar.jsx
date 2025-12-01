import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { LogOut, ShoppingBag, UserRound } from "lucide-react";

function Navbar({ authUser, onLogout }) {
  return (
    <nav className="bg-white shadow-md border-0">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-10"
              src={Logo}
              alt="Logo"
              title="AppleRocket - E-commerce store"
            />
          </Link>
        </div>

        {/* Right Section */}
        <div>
          {authUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-1 text-gray-700">
                <UserRound className="w-5 h-5 text-gray-600" />
                <strong>{authUser}</strong>
              </span>

              <Link
                to="/products"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline">Products</span>
              </Link>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-1.5 bg-[#536074] text-white rounded-xl hover:scale-105 hover:shadow-md transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-1.5 bg-[#a5a885] text-white rounded-xl hover:scale-105 hover:shadow-md transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
