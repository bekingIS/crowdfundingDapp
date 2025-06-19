import { useState, useEffect } from "react";
import { createProject } from "../services/project";
import { ethers } from "ethers";

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Установите MetaMask");
      return;
    }

    try {
      const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(addr);
    } catch (err) {
      console.error("❌ Ошибка подключения:", err);
    }
  };

  const handleCreate = async () => {
    if (!title || !description || !goal || !account) {
      setStatus("❗ Заполните все поля и подключите кошелек");
      return;
    }

    const data = {
      title,
      description,
      fundingGoal: Number(goal),
      ownerAddress: account,
    };

    try {
      setStatus("⏳ Создание проекта...");
      const res = await createProject(data);

      if (res.id) {
        setStatus("✅ Проект создан успешно! ID: " + res.id);
        setTitle("");
        setDescription("");
        setGoal("");
      } else {
        throw new Error("Ошибка создания проекта");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Ошибка: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🚀 Создание нового стартапа</h2>

      <input
        type="text"
        placeholder="Название проекта"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Описание проекта"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...styles.input, height: "100px" }}
      />

      <input
        type="number"
        placeholder="Цель в BNB"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={styles.input}
      />

      <p>💼 Кошелек: <strong>{account || "не подключен"}</strong></p>

      <button onClick={handleCreate} style={styles.button}>
        📤 Создать проект
      </button>

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
    borderRadius: "4px",
    border: "1px solid #ccc",
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
    color: "#333",
  },
};

export default CreateProject;
