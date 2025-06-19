import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "960px", margin: "0 auto" }}>
      {/* Hero-блок */}
      <section style={{ marginBottom: "4rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          🚀 Добро пожаловать на BNB Crowdfunding
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", maxWidth: "700px", margin: "0 auto" }}>
          Платформа нового поколения для финансирования стартапов с помощью блокчейн-технологий.
          Создавайте, инвестируйте и развивайтесь вместе с нами.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <Link to="/login">
            <button style={styles.primaryButton}>🔐 Войти</button>
          </Link>
          <Link to="/dashboard">
            <button style={styles.secondaryButton}>📁 Мои проекты</button>
          </Link>
        </div>
      </section>

      {/* Популярные проекты */}
      <section>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>🔥 Популярные проекты</h2>

        <div style={styles.projectCard}>
          <h3 style={styles.projectTitle}>Проект 1: Умный контракт для логистики</h3>
          <p>📈 Цель: <strong>10 BNB</strong></p>
          <p>💰 Собрано: <strong>6.4 BNB</strong></p>
          <progress value="6.4" max="10" style={{ width: "100%", height: "10px" }} />
        </div>

        {/* Тут можно будет подгружать проекты динамически */}
      </section>
    </div>
  );
}

const styles = {
  primaryButton: {
    padding: "0.6rem 1.2rem",
    marginRight: "1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  secondaryButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  projectCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    backgroundColor: "#fafafa",
  },
  projectTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
};

export default Home;
