import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { register } from "./services/auth"; // Только для регистрации

function LoginRegister() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("investor");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const token = await userCredential.user.getIdToken(); // ✅ ID токен
      const uid = userCredential.user.uid;

      // 📥 Только при регистрации — сохранить в Firestore через backend
      if (!isLogin) {
        await register({
          uid,
          email,
          role,
          walletAddress,
        });
      }

      // ✅ Сохраняем в контекст
      authLogin(token, role, uid);

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Ошибка входа:", err.message);
      setError(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "🔐 Вход" : "📝 Регистрация"}</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={styles.input}
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        style={styles.input}
        required
      />

      {!isLogin && (
        <>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="investor">Инвестор</option>
            <option value="founder">Стартапер</option>
          </select>

          <input
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Адрес кошелька"
            style={styles.input}
            required
          />
        </>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? "⏳..." : isLogin ? "➡ Войти" : "📘 Зарегистрироваться"}
      </button>

      <p>
        {isLogin ? "Нет аккаунта?" : "Уже зарегистрированы?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} style={styles.toggle}>
          {isLogin ? "Зарегистрироваться" : "Войти"}
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    textAlign: "center",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
  },
  input: {
    padding: "0.8rem",
    margin: "0.5rem 0",
    width: "100%",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    width: "100%",
    fontSize: "1rem",
    backgroundColor: "#2d8cf0",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggle: {
    background: "none",
    border: "none",
    color: "#2d8cf0",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
};

export default LoginRegister;
