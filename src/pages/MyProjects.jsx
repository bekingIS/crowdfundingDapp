import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { getProjects } from "../services/project";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getProfile();
        const wallet = profile.user?.address;
        setAccount(wallet);

        const allProjects = await getProjects();
        const filtered = allProjects.filter(
          (p) => p.ownerAddress?.toLowerCase() === wallet?.toLowerCase()
        );
        setProjects(filtered);
      } catch (err) {
        console.error("Ошибка загрузки проектов:", err.message);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📁 Мои проекты</h2>
      {projects.length === 0 ? (
        <p>У вас пока нет проектов</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p><strong>Цель:</strong> {p.fundingGoal} BNB</p>
            <p><strong>Адрес:</strong> {p.ownerAddress}</p>
            <p><strong>Статус:</strong> {p.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyProjects;
