import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
    const swUrl = new URL("sw.js", appBase);
    let hasRefreshedForNewWorker = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hasRefreshedForNewWorker) {
        return;
      }

      hasRefreshedForNewWorker = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register(swUrl, { scope: import.meta.env.BASE_URL })
      .then((registration) => registration.update())
      .catch(() => {
        // Ignore failed registration in unsupported or local preview contexts.
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
