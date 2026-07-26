import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SiteProvider } from "./store/SiteContext";
import ThemeApplier from "./theme/ThemeApplier";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteProvider>
      <ThemeApplier />
      <App />
    </SiteProvider>
  </StrictMode>
);
