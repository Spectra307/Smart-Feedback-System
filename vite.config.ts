import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Log environment variables in development (for debugging)
  if (mode === "development") {
    console.log("[Vite Config] Loading environment variables...");
    console.log("  VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL ? "✓ Set" : "✗ Missing");
    console.log("  VITE_SUPABASE_ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing");
  }

  return {
    server: {
      host: "::",
      port: 5173,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
