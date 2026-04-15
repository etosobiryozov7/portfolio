import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const words = ["Creative", "Frontend", "Developer"];

const stats = [
  { value: "10+", label: "Mini Projects" },
  { value: "100%", label: "Responsive UI" },
  { value: "24/7", label: "Learning Mode" },
];

function Home() {
  return (
    <section className="section hero">
      <div>
        <motion.p
          className="tag"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          MODERN PORTFOLIO
        </motion.p>

        <h1 className="hero-title">
          {words.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.15 + index * 0.15,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          I build clean, animated and modern websites with React. I enjoy
          making black & white interfaces that feel premium, smooth and
          memorable.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Link to="/projects" className="btn primary-btn">
            View Projects
          </Link>
          <Link to="/contact" className="btn ghost-btn">
            Contact Me
          </Link>
        </motion.div>

        <div className="stats-grid">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              className="stat-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.12 }}
            >
              <h3 className="stat-value">{item.value}</h3>
              <p className="stat-label">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="image-ring">
          <img src="/photome.jpg" alt="profile" className="hero-image" />
        </div>

        <div className="floating-card card-a">React + Vite</div>
        <div className="floating-card card-b">Smooth UI Motion</div>
      </motion.div>
    </section>
  );
}

export default Home;