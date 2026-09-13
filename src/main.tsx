import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./lib/AuthContext";
import { ThemeProvider } from "./lib/ThemeContext";
import "./index.css";

// Auto-recover if dynamic chunk hashes change after a redeployment
window.addEventListener("vite:preloadError", (event) => {
  console.warn("New application build detected. Reloading to latest version...", event);
  window.location.reload();
});

window.addEventListener("error", (e) => {
  const msg = String(e?.message || "");
  if (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Loading chunk")
  ) {
    const lastReload = sessionStorage.getItem("gtc_chunk_reload_time");
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem("gtc_chunk_reload_time", String(now));
      window.location.reload();
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
