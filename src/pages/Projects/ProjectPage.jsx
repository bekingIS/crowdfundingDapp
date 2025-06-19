import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById, updateProject} from "../../services/project";
import { ethers } from "ethers";
import abi from "../../abi/Investment.json";
import { CONTRACT_ADDRESS } from "../../utils/config";



function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      console.error("❌ Ошибка загрузки проекта:", err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Установите MetaMask");

    try {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(account);
    } catch (err) {
      console.error("❌ Ошибка подключения MetaMask:", err);
    }
  };

  const invest = async () => {
    if (!window.ethereum || !account) return alert("Подключите MetaMask");
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  
      const value = ethers.parseEther(amount);
  
      setStatus("⏳ Отправка транзакции...");
      setLoading(true);
  
      const tx = await contract.invest(project.id, { value });
      await tx.wait();
  
      const investedAmount = parseFloat(amount);
      const newRaised = parseFloat(project.raised) + investedAmount;
  
      const updates = { raised: newRaised };
      if (newRaised >= parseFloat(project.fundingGoal)) {
        updates.funded = true;
      }
  
      setProject({ ...project, ...updates }); // обновляем UI
      await updateProject(project.id, updates); // отправляем на backend
  
      setStatus("✅ Инвестиция прошла успешно!");
      setAmount("0.01");
    } catch (err) {
      console.error("❌ Ошибка транзакции:", err);
      setStatus("❌ Ошибка транзакции");
    } finally {
      setLoading(false);
    }
  };
  
  

  if (!project) return <p>⏳ Загрузка проекта...</p>;

  return (
    <div style={styles.container}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>🎯 Цель: {project.fundingGoal} BNB</p>
      <p>💰 Собрано: {project.raised} BNB</p>
      <p>🧑‍💼 Владелец: {project.ownerAddress}</p>
      <p>📦 Статус: {project.funded ? "✅ Проект завершён" : "🟡 В процессе"}</p>

      {!account ? (
        <button style={styles.button} onClick={connectWallet}>
          🔌 Подключить MetaMask
        </button>
      ) : (
        <>
          <input
            type="number"
            min="0.001"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму в BNB"
            style={styles.input}
          />
          <button onClick={invest} style={styles.button} disabled={loading}>
            💸 {loading ? "Инвестирование..." : "Инвестировать"}
          </button>
        </>
      )}

      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    backgroundColor: "#2d8cf0",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  status: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
};

export default ProjectPage;
