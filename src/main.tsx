import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
        const scopePath = appBase.pathname.endsWith("/") ? appBase.pathname : `${appBase.pathname}/`;

        return Promise.all(
          registrations
            .filter((registration) => {
              try {
                return new URL(registration.scope).pathname.startsWith(scopePath);
              } catch (_error) {
                return false;
              }
            })
            .map((registration) => registration.unregister())
        );
      })
      .then(() => {
        if (!("caches" in window)) {
          return;
        }

        return caches
          .keys()
          .then((keys) =>
            Promise.all(keys.filter((key) => key.startsWith("geomemory-shell-")).map((key) => caches.delete(key)))
          )
          .then(() => undefined);
      })
      .catch(() => {
        // Ignore unsupported or partially-cached mobile browser states.
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
