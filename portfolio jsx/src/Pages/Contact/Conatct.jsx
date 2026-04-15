import { motion } from "framer-motion";

const contacts = [
  {
    title: "Email",
    text: "Project, freelance or collaboration uchun email orqali bog‘laning.",
    link: "abbossabiryozov6@gmail.com",
    action: "Send Email",
  },
  {
    title: "Telegram",
    text: "Tezroq gaplashish uchun telegram profilingizni shu yerga ulang.",
    link: "https://t.me/etosobiryozov7",
    action: "Open Telegram",
  },
  {
    title: "Instagram",
    text: "Portfolio va dizayn ishlari uchun Instagram profilingizni qo‘shing.",
    link: "https://www.instagram.com/sobiryozov7/",
    action: "Open Instagram",
  },
];

function Contact() {
  return (
    <section className="section">
      <div>
        <motion.p
          className="tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          CONTACT
        </motion.p>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Let’s build something cool.
        </motion.h2>

        <motion.p
          className="section-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pastdagi linklarni o‘zingning ma’lumotlaringga almashtirib qo‘y.
        </motion.p>

        <div className="contact-grid">
          {contacts.map((item, index) => (
            <motion.div
              className="contact-card"
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {item.title === "Instagram" && (
                <img src="/Insta.png" alt="instagram" className="social-logo" />
              )}

              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <a href={item.link} className="btn primary-btn" target="_blank" rel="noreferrer">
                {item.action}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="footer-note">
          © 2026 Abbos Portfolio. Built with React & Motion.
        </p>
      </div>
    </section>
  );
}

export default Contact;