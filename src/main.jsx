import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Projects from "./pages/Projects/Projects";
import ProjectPage from "./pages/Projects/ProjectPage";
import CreateProject from "./pages/CreateProject";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import MainLayout from "./components/MainLayout";
import { WalletProvider } from "./context/WalletContext"; //
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <WalletProvider> {/* Оборачиваем всё приложение */}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
    </AuthProvider>
  </React.StrictMode>
);
