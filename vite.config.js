import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Auto-detect the correct GitHub Pages base path.
// - In GitHub Actions, GITHUB_REPOSITORY = "owner/repo".
//   * Project page (repo != "<owner>.github.io") -> base "/repo/"
//   * User/org page (repo ends with ".github.io") -> base "/"
// - Locally (no GITHUB_REPOSITORY) -> base "/".
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/";

export default defineConfig({
  plugins: [react()],
  base,
  server: { port: 5178, strictPort: true },
});
