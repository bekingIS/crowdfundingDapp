import { Outlet } from "react-router-dom";
import Header from "./Header";

function MainLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
