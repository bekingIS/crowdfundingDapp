import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [uid, setUid] = useState(localStorage.getItem("uid") || "");
  const [walletAddress, setWalletAddress] = useState("");

  const login = async (token, roleGuess, uid) => {
    localStorage.setItem("token", token);
    localStorage.setItem("uid", uid);
    setToken(token);
    setUid(uid);

    //  Загрузим профиль с сервера
    try {
      const profile = await getProfile(uid, token);

      const finalRole = profile.role || roleGuess;
      const wallet = profile.walletAddress || "";

      setRole(finalRole);
      setWalletAddress(wallet);

      localStorage.setItem("role", finalRole);
      localStorage.setItem("walletAddress", wallet);

      // опционально — сохраняем всё одним объектом
      localStorage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("❌ Ошибка загрузки профиля при входе:", err.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    setUid("");
    setRole("");
    setWalletAddress("");
  };

  return (
    <AuthContext.Provider value={{ token, role, uid, walletAddress, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
