import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" data-oid="tbs:0av">
    <App data-oid="lhf:96." />
  </ThemeProvider>,
);
