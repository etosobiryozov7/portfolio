import { motion } from "framer-motion";
import "./About.css";
import { title } from "framer-motion/client";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPython,
  FaReact,
} from "react-icons/fa";

const skil = [
    {
      name: "HTML",
      icon: <FaHtml5 />,
      percent: "95%",
      text: "3 yillik tajriba",
      color: "#e44d26",
    },
    {
      name: "CSS",
      icon: <FaCss3Alt />,
      percent: "75%",
      text: "3 yillik tajriba",
      color: "#1572b6",
    },
    {
      name: "JavaScript",
      icon: <FaJs />,
      percent: "60%",
      text: "1 yillik tajriba",
      color: "#f7df1e",
    },
    {
      name: "Python",
      icon: <FaPython />,
      percent: "70%",
      text: "2 yillik tajriba",
      color: "#3776ab",
    },
    {
      name: "React",
      icon: <FaReact />,
      percent: "50%",
      text: "4 oylik tajriba",
      color: "#61dafb",
    },
  ];



const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Vite",
  "Responsive Design",
  "UI Animation",
  "GitHub",
  "Clean Components",
  "Modern Layouts",
];

const timeline = [
  {
    year: "2024",
    title: "Started web development",
    text: "Learned the basics of HTML, CSS and page structure.",
  },
  {
    year: "2025",
    title: "Focused on React",
    text: "Built components, pages and interactive interfaces using React.",
  },
  {
    year: "2026",
    title: "Creating portfolio projects",
    text: "Working on stylish portfolio, music and frontend based projects.",
  },
];

const gameTime =[
  {
    year: "2024",
    title: "CS 1.6"
  },
  {
    year: "2019",
    title: "Pubg Mobile"
  },
  {
    year: "2025",
    title: "CS GO"
  },
  {
    year:"2024",
    title: "Standoff 2"
  }
]

function About() {
  return (
    <section className="section">
      <div className="two-col">
        <motion.div
          className="content-block about-card-highlight"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="tag">ABOUT ME</p>
          <h2 className="section-title">
            I design clean and memorable digital experiences.
          </h2>

          <p className="section-text">
            I am a frontend developer who likes minimal black and white design,
            smooth transitions and modern layouts. My goal is to create websites
            that look premium and feel alive.
          </p>

          <div className="about-quote">
            I like turning simple ideas into stylish and responsive web
            interfaces.
          </div>

          <div className="pill-list">
            {skills.map((skill) => (
              <span key={skill} className="pill">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="content-block"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="small-title">Journey</h3>

          <div className="timeline">
            {timeline.map((item) => (
              <div key={item.year} className="timeline-item">
                <p className="timeline-year">{item.year}</p>
                <h4>{item.title}</h4>
                <p className="section-text">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
        <motion.div
          className="time-game-text"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h1>Games I play in my spare time</h1>
        </motion.div>
        <motion.div
          className="content-block"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}   
          transition={{ duration: 0.7 }}
        >
          <h3 className="gameTime-h3">Games</h3>

          <div className="gameTime"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {gameTime.map((item) => (
              <div key={item.year} className="gameTime-item">
                <p className="gameTime-year">{item.year}</p>
                <h4>{item.title}</h4>
              </div>
            ))}
          </div>
        </motion.div>


        <div className="skills-section">
      <h1 className="title">My Skills</h1>

      <div className="skills-row">
        {skil.map((item, index) => (
          <div
            className="skill-card"
            key={index}
            style={{ "--main-color": item.color }}
          >
            <div className="skill-icon">{item.icon}</div>

            <div className="skill-content">
              <h2>{item.name}</h2>
              <p>{item.text}</p>

              <div className="skill-percent-box">
                <span>Bilish darajasi</span>
                <div className="skill-line">
                  <div
                    className="skill-fill"
                    style={{ width: item.percent }}
                  ></div>
                </div>
                <strong>{item.percent}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}

export default About;