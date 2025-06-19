import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { getProjects, updateProject } from "../services/project";
import { ethers } from "ethers";
import abi from "../abi/Investment.json";
import { CONTRACT_ADDRESS } from "../utils/config";

function Dashboard() {
  const { token, uid } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);

  useEffect(() => {
    if (!uid || !token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfile(uid, token);
        setProfile(data);

        const all = await getProjects();

        if (data.role === "founder") {
          const own = all.filter(
            (p) =>
              p.ownerAddress?.toLowerCase() === data.walletAddress?.toLowerCase()
          );
          setMyProjects(own);
        }

        if (data.role === "investor") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
          const investor = data.walletAddress?.toLowerCase();

          const investments = [];
          for (const project of all) {
            const amount = await contract.getInvestment(project.id, investor);
            const parsed = parseFloat(ethers.formatEther(amount));
            if (parsed > 0) {
              investments.push({ ...project, invested: parsed });
            }
          }

          setMyInvestments(investments);
        }
      } catch (err) {
        console.error("Ошибка загрузки профиля или данных:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const finalizeProject = async (project) => {
    try {
      if (!window.ethereum) return alert("Установите MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.finalize(project.id);
      await tx.wait();

      await updateProject(project.id, { funded: true });

      alert("✅ Средства успешно выведены!");
      setMyProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, funded: true } : p
        )
      );
    } catch (err) {
      console.error("❌ Ошибка вывода средств:", err);
      alert("Ошибка при завершении проекта.");
    }
  };

  if (loading) return <p style={styles.loading}>⏳ Загрузка профиля...</p>;
  if (!profile) return <p style={styles.error}>❌ Профиль не найден</p>;

  return (
    <div style={styles.container}>
      <h2>👤 Личный кабинет</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Роль:</strong> {profile.role}</p>
      <p><strong>Адрес кошелька:</strong> {profile.walletAddress}</p>

      {profile.role === "founder" && (
        <div style={styles.section}>
          <h3>🚀 Мои стартапы</h3>
          {myProjects.length === 0 && <p>Нет созданных проектов.</p>}
          {myProjects.map((project) => (
            <div key={project.id} style={styles.projectBox}>
              <h4>{project.title}</h4>
              <p>🎯 Цель: {project.fundingGoal} BNB</p>
              <p>💰 Собрано: {project.raised} BNB</p>
              <p>📦 Статус: {project.funded ? "✅ Завершён" : "🟡 В процессе"}</p>

              {!project.funded &&
                parseFloat(project.raised) >= parseFloat(project.fundingGoal) && (
                  <button style={styles.finalizeButton} onClick={() => finalizeProject(project)}>
                    💸 Вывести средства
                  </button>
              )}

              {project.funded && (
                <p style={styles.fundedText}>✅ Средства выведены</p>
              )}
            </div>
          ))}
        </div>
      )}

      {profile.role === "investor" && (
        <div style={styles.section}>
          <h3>💼 Мои инвестиции</h3>
          {myInvestments.length === 0 && <p>Пока нет инвестиций.</p>}
          {myInvestments.map((p) => (
            <div key={p.id} style={styles.projectBox}>
              <h4>{p.title}</h4>
              <p>🎯 Цель: {p.fundingGoal} BNB</p>
              <p>💰 Собрано: {p.raised} BNB</p>
              <p>📥 Вы инвестировали: <strong>{p.invested} BNB</strong></p>
              <p>📦 Статус: {p.funded ? "✅ Завершён" : "🟡 В процессе"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    marginTop: "2rem",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "2rem",
  },
  section: {
    marginTop: "2rem",
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "4px",
  },
  projectBox: {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "1rem",
  },
  finalizeButton: {
    marginTop: "1rem",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  fundedText: {
    color: "green",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
};

export default Dashboard;
