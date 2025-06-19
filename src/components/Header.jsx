import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>🏠 Главная</Link>
        <Link to="/projects" style={styles.link}>📂 Проекты</Link>
        {role === "founder" && <Link to="/create" style={styles.link}>➕ Создать проект</Link>}
        {token && <Link to="/dashboard" style={styles.link}>👤 Кабинет</Link>}
      </nav>

      <div>
        {token ? (
          <button onClick={handleLogout} style={styles.button}>🚪 Выйти</button>
        ) : (
          <Link to="/login" style={styles.button}>🔐 Войти</Link>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: "1rem 2rem",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  nav: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    textDecoration: "none",
    color: "#2d8cf0",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2d8cf0",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;
