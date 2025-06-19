import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi/Investment.json";
import { CONTRACT_ADDRESS } from "./utils/config";
import LoginRegister from "./LoginRegister";
import { getProfile, logout } from "./services/auth";
import { useNavigate } from "react-router-dom";
import { createProject, getProjects } from "./services/project";
import Header from "./components/Header";


function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [startups, setStartups] = useState([]);
  const [goal, setGoal] = useState("");
  const [sname, setTitle] = useState("");
  const [desc, setDescription] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [myStartups, setMyStartups] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setIsFounder(false);
    setUserEmail("");
    setAccount(null);
    navigate("/login");
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Установи MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await _provider.getSigner();
    const address = accounts[0];

    setAccount(address);
    setProvider(_provider);

    const _contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    setContract(_contract);
  };

  const loadStartups = async () => {
    try {
      const loaded = await getProjects(); // с project-service
      const enriched = await Promise.all(
        loaded.map(async (p) => {
          try {
            const s = await contract.startups(p.id); // из смарт-контракта
            return {
              ...p,
              goal: ethers.formatEther(s.goal),
              raised: ethers.formatEther(s.raised),
              funded: s.funded,
              founder: s.founder,
            };
          } catch (err) {
            console.error("Ошибка получения данных из контракта:", err.message);
            return p;
          }
        })
      );
  
      setStartups(enriched);
  
      if (account) {
        const mine = enriched.filter(
          (s) => s.ownerAddress?.toLowerCase() === account?.toLowerCase()
        );
        setMyStartups(mine);
      }
    } catch (err) {
      console.error("Ошибка загрузки стартапов:", err.message);
    }
  };
  
  
  
  

  const handleCreateStartup = async () => {
    if (!goal || !isAuthenticated || !isFounder) return;

    try {
      const data = {
        title: sname,
        description: desc,
        fundingGoal: goal,
        ownerAddress: account,
      };

      await createProject(data);
      alert("✅ Стартап создан");
      setGoal("");
      setTitle("");
      setDescription("");
      loadStartups();
    } catch (err) {
      alert("❌ Ошибка: " + err.message);
    }
  };

  const handleInvest = async (id) => {
    const amount = prompt("Введите сумму tBNB:");
    if (!amount || !provider) return;

    const signer = await provider.getSigner();
    const tx = await contract.connect(signer).invest(id, {
      value: ethers.parseEther(amount),
    });
    await tx.wait();

    alert("✅ Инвестиция прошла");
    loadStartups();
  };

  const handleFinalize = async (id) => {
    try {
      const tx = await contract.finalize(id);
      await tx.wait();
      alert("✅ Средства отправлены основателю");
      loadStartups();
    } catch (err) {
      alert("❌ Ошибка завершения: " + err.message);
    }
  };

  const handleRefund = async (id) => {
    try {
      const tx = await contract.refund(id);
      await tx.wait();
      alert("🔁 Средства возвращены инвестору");
      loadStartups();
    } catch (err) {
      alert("❌ Ошибка возврата: " + err.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getProfile();
        if (res.user) {
          setIsAuthenticated(true);
          setUserEmail(res.user.email);
          setIsFounder(res.user.role === "founder");
        }
      } catch {
        setIsAuthenticated(false);
        setIsFounder(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (contract && account) loadStartups();
  }, [contract, account]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🚀 BNB Crowdfunding</h1>

      {!isAuthenticated && <LoginRegister />}

      {userEmail && (
        <div style={{ marginBottom: "1rem" }}>
          <p>
            👤 Вы вошли как: <strong>{userEmail}</strong><br />
            🧩 Роль: <strong>{isFounder ? "founder" : "investor"}</strong>
          </p>
          <button onClick={handleLogout}>🚪 Выйти</button>
        </div>
      )}

      {account && <p>💼 Кошелёк: {account}</p>}

      {!account ? (
        <button onClick={connectWallet}>🔌 Подключить MetaMask</button>
      ) : (
        <>
          {/* ➕ Создать стартап */}
          {isAuthenticated && isFounder && (
            <>
              <h2>➕ Создать стартап</h2>
              <input
                type="text"
                placeholder="Название"
                value={sname}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Описание"
                value={desc}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Цель в BNB"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <button onClick={handleCreateStartup}>Создать</button>
            </>
          )}

          {/* 📁 Мои проекты */}
          {isFounder && myStartups.length > 0 && (
            <>
              <h2>📁 Мои проекты</h2>
              {myStartups.map((s) => (
                <div key={s.id} style={{ border: "1px dashed #aaa", margin: "1rem 0", padding: "1rem" }}>
                  <p><strong>ID:</strong> {s.id}</p>
                  <p><strong>Цель:</strong> {s.goal} BNB</p>
                  <p><strong>Собрано:</strong> {s.raised} BNB</p>
                  <p><strong>Статус:</strong> {s.funded ? "✅ Завершено" : "⏳ Ожидает"}</p>
                </div>
              ))}
            </>
          )}

          {/* 📦 Список всех стартапов */}
          <h2>📦 Список стартапов</h2>
          {startups.map((s) => (
            <div key={s.id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
              <p><strong>ID:</strong> {s.id}</p>
              <p><strong>Владелец:</strong> {s.founder}</p>
              <p><strong>Цель:</strong> {s.goal} BNB</p>
              <p><strong>Собрано:</strong> {s.raised} BNB</p>
              <p><strong>Статус:</strong> {s.funded ? "✅ Завершено" : "⏳ Ожидает"}</p>

              {!s.funded && (
                <>
                  <button onClick={() => handleInvest(s.id)}>💸 Инвестировать</button>

                  {isFounder && account?.toLowerCase() === s.founder?.toLowerCase() && (
                    <button onClick={() => handleFinalize(s.id)}>✅ Завершить</button>
                  )}

                  <button onClick={() => handleRefund(s.id)}>🔁 Вернуть</button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}


export default App;
