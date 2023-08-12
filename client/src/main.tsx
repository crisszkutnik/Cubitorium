import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WalletContext } from "./modules/context/WalletContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletContext>
      <div>
        <App />
      </div>
    </WalletContext>
  </React.StrictMode>
);
