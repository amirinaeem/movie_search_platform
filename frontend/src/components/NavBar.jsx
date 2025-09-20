import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="container max-w-6xl flex items-center justify-between py-3">
        {/* Logo + Title */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          <span className="w-8 h-8 rounded-full overflow-hidden border border-indigo-600 shadow">
            <img
              src="/noposter.jpg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </span>
          <span className="text-lg tracking-tight">WATERFLIX.COM</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-md ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-slate-100 text-slate-700"
              }`
            }
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-slate-100 text-slate-700"
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
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
                  `px-3 py-1.5 rounded-md ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-slate-100 text-slate-700"
                  }`
                }
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow"
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
