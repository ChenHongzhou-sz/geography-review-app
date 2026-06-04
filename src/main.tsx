import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
    const swUrl = new URL("sw.js", appBase);

    navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL }).catch(() => {
      // Ignore failed registration in unsupported or local preview contexts.
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
