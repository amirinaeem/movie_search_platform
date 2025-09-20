import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="container max-w-6xl flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-indigo-600">
          <span className="text-2xl">🎬</span>
          <span className="text-lg">Movie Search</span>
        </Link>

        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
            }
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
                }
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow`
                }
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
