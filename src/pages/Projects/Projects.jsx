import { useEffect, useState } from "react";
import { getProjects } from "../../services/project";
import { Link } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getProjects();
      const sorted = data.sort((a, b) => Number(b.funded) - Number(a.funded)); // funded проекты сверху
      setProjects(sorted);
      setFiltered(sorted);
    };
    load();
  }, []);

  useEffect(() => {
    const result = projects.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, projects]);

  return (
    <div style={styles.container}>
      <h1>📂 Каталог стартапов</h1>

      <input
        type="text"
        placeholder="🔍 Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filtered.length === 0 && <p>❌ Ничего не найдено.</p>}

      {filtered.map((project) => {
        const percent = Math.min((project.raised / project.fundingGoal) * 100, 100).toFixed(0);
        return (
          <div key={project.id} style={styles.card}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>🎯 Цель: {project.fundingGoal} BNB</p>
            <p>💰 Собрано: {project.raised} BNB ({percent}%)</p>

            <div style={styles.progressBar}>
              <div style={{ ...styles.progress, width: `${percent}%` }} />
            </div>

            {project.funded && <p style={styles.funded}>✅ Проект профинансирован!</p>}

            <Link to={`/project/${project.id}`} style={styles.link}>
              Подробнее →
            </Link>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  search: {
    marginBottom: "1rem",
    padding: "0.5rem",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#fff",
  },
  link: {
    display: "inline-block",
    marginTop: "0.5rem",
    color: "#2d8cf0",
    textDecoration: "none",
  },
  funded: {
    color: "green",
    fontWeight: "bold",
  },
  progressBar: {
    height: "10px",
    background: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
    margin: "0.5rem 0",
  },
  progress: {
    height: "100%",
    backgroundColor: "#2d8cf0",
  },
};

export default Projects;
