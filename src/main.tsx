import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = new URL("sw.js", window.location.href);

    navigator.serviceWorker.register(swUrl, { scope: "./" }).catch(() => {
      // Ignore failed registration in unsupported or local preview contexts.
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
