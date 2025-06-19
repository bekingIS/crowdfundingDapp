const API_URL = "http://localhost:5000/projects";

// Получить список всех проектов
export const getProjects = async () => {
  try {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error("Ошибка загрузки проектов");
    return await res.json();
  } catch (err) {
    console.error("❌ getProjects:", err.message);
    return [];
  }
};

// Получить проект по ID
export const getProjectById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Проект не найден");
    return await res.json();
  } catch (err) {
    console.error("❌ getProjectById:", err.message);
    return null;
  }
};

// Создать новый проект
export const createProject = async (data) => {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Ошибка создания проекта");
    return await res.json();
  } catch (err) {
    console.error("❌ createProject:", err.message);
    return { error: err.message };
  }
};

// Обновить проект
export const updateProject = async (id, updates) => {
  try {
    const res = await fetch(`${API_URL}/update/${String(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Ошибка обновления проекта");
    return await res.json();
  } catch (err) {
    console.error("❌ updateProject:", err.message);
    return { error: err.message };
  }
};
