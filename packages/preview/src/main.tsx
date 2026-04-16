import { createRoot } from "react-dom/client";
import "@ds/tokens/tokens.css";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element");
createRoot(container).render(<App />);
