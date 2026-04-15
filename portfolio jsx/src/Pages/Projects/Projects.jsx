import { motion } from "framer-motion";

const projects = [
  {
    number: "01",
    title: "Music Website",
    text: "A modern music platform UI with categories, album cards and stylish player sections.",
    tags: ["React", "Audio UI", "Modern Layout"],
  },
  {
    number: "02",
    title: "Admin Dashboard",
    text: "A clean panel design with cards, stats and responsive sections for data management.",
    tags: ["Dashboard", "Responsive", "UI Design"],
  },
  {
    number: "03",
    title: "Portfolio Website",
    text: "A premium black and white portfolio with animations, theme toggle and page transitions.",
    tags: ["Portfolio", "Animation", "Framer Motion"],
  },
  {
    number: "04",
    title: "Game Landing Page",
    text: "A bold visual landing page for game content with hover effects and modern typography.",
    tags: ["Landing Page", "Creative", "Interactive"],
  },
];

function Projects() {
  return (
    <section className="section">
      <div>
        <motion.p
          className="tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          MY WORK
        </motion.p>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Selected Projects
        </motion.h2>

        <motion.p
          className="section-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          These are example portfolio blocks. Demo va code linklarni keyin o‘zing
          qo‘shib chiqasan.
        </motion.p>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              className="project-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="project-number">{project.number}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-text">{project.text}</p>

              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="project-links">
                <a href="#" className="btn ghost-btn">
                  Live Demo
                </a>
                <a href="#" className="btn ghost-btn">
                  Source Code
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;