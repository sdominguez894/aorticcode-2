import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

/**
 * Application entry point
 * Initializes React root and renders the App component
 */
createRoot(document.getElementById("root")!).render(<App />);
