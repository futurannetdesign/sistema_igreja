import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

async function deployToGithubPages(): Promise<void> {
  try {
    console.log("🚀 Starting deployment to GitHub Pages...");

    // Clean previous builds
    console.log("1. Cleaning previous builds...");
    execSync("rm -rf .next out", { stdio: "inherit" });

    // Build the project
    console.log("2. Building project...");
    execSync("next build", { stdio: "inherit" });

    // Create .nojekyll file
    console.log("3. Creating .nojekyll file...");
    fs.writeFileSync(path.join(process.cwd(), "out", ".nojekyll"), "");

    // Deploy to GitHub Pages with simpler command
    console.log("4. Deploying to GitHub Pages...");
    execSync("gh-pages -d out", { stdio: "inherit" });

    console.log("✅ Deployment successful!");
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

deployToGithubPages().catch(console.error);
