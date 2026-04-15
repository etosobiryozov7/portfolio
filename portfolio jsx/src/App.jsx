import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Companents/Navbar";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Projects from "./Pages/Projects/Projects";
import Contact from "./Pages/Contact/Conatct";
import Game from "./Pages/Game/Game"
import Error from "./Pages/Error/Error"
import "./App.css";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);


function App() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  

  return (
    <div className="app-shell">
      <div className="bg-grid" />

      <motion.div
        className="floating-orb orb-one"
        animate={{ y: [0, -25, 0], x: [0, 12, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="floating-orb orb-two"
        animate={{ y: [0, 25, 0], x: [0, -14, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="page-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />
            <Route
              path="/projects"
              element={
                <PageWrapper>
                  <Projects />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route 
              path="/game"
              element={
                <PageWrapper>
                  <Game />
                </PageWrapper>
              }
            />
            <Route
              path="*" element=
              {<Error />}
               />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;