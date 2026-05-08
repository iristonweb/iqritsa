import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  void window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
