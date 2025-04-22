import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./tests/setup.ts"
    },
    define: {
      "process.env": env,
    },

  };
}) as UserConfig;
