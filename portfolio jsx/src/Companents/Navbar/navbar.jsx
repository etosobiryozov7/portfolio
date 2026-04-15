import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { path } from "framer-motion/client";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
  { name: "Game", path: "/game"}
];


function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          Abbosbek<span>.</span>
        </NavLink>

        <div className={`nav-links ${open ? "active" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {/* <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ rotate: theme === "dark" ? -15 : 15 }}
            className="theme-toggle"
            onClick={toggleTheme}
          >
            <span>{theme === "dark" ? "☀" : "☾"}</span>
          </motion.button> */}

          <button className="menu-btn" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;