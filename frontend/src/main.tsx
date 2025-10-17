import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "./lib/supabase";

declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

if (typeof window !== "undefined") {
  window.supabase = supabase;
}

createRoot(document.getElementById("root")!).render(<App />);
