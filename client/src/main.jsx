import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/Auth.jsx";
import { PropertyContextProvider } from "./context/Properties.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <PropertyContextProvider>
        <App />
      </PropertyContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
