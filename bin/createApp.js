#!/usr/bin/env node

import { execSync } from "child_process";
import { chdir } from "process";
import chalk from "chalk";
import { join } from "path";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  rmSync,
  readFileSync,
  writeFileSync
} from "fs";

const log = (emoji, color, message) =>
  console.log(`${emoji} ${chalk[color](message)}`);

const checkPnpm = () => {
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const runCommand = (command, errorMessage) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    log("❌", "red", errorMessage);
    process.exit(1);
  }
};

const main = () => {
  // Check for required arguments
  if (process.argv.length < 3) {
    log("❌", "red", "Please specify a project directory");
    process.exit(1);
  }

  const projectDir = process.argv[2];

  // Check for pnpm
  log("🔍", "cyan", "Checking for pnpm...");

  const hasPnpm = checkPnpm();

  log(
    hasPnpm ? "✅" : "⚠️",
    hasPnpm ? "green" : "yellow",
    hasPnpm ? "pnpm found!" : "pnpm not found, will use npm"
  );

  // Create project directory
  log("📁", "blue", `Creating directory ${projectDir}...`);

  if (existsSync(projectDir)) {
    log("❌", "red", `Directory ${projectDir} already exists`);
    process.exit(1);
  }

  mkdirSync(projectDir, { recursive: true });

  // Clone repo and change directory
  log("📦", "magenta", "Cloning template repository...");

  runCommand(
    `git clone --quiet https://github.com/ividrine/modern-express-api-sql.git ${projectDir}`,
    "Failed to clone repository"
  );

  log("🚀", "blue", `Changing to project directory ${projectDir}...`);

  chdir(projectDir);

  // Remove chalk as project dependency
  log("✅", "green", "Removing unnecessary dependencies");
  const packageJsonPath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  if (packageJson.dependencies?.chalk) {
    delete packageJson.dependencies.chalk;
  }
  if (packageJson.devDependencies?.chalk) {
    delete packageJson.devDependencies.chalk;
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

  // Install dependencies
  log("⚙️", "yellow", "Installing project dependencies...");
  runCommand(
    hasPnpm ? "pnpm install" : "npm install",
    "Failed to install dependencies"
  );

  // Copy environment file
  log("📝", "green", "Copying .env.example to .env...");

  const envExamplePath = join(process.cwd(), ".env.example");
  const envPath = join(process.cwd(), ".env");

  if (existsSync(envExamplePath)) {
    copyFileSync(envExamplePath, envPath);
  } else {
    log("⚠️", "yellow", ".env.example not found");
  }

  // Clean up
  log("🗑️", "red", "Cleaning up...");
  const gitDir = join(process.cwd(), ".git");
  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true });
  }

  const createAppScript = join(process.cwd(), "bin", "createApp.js");
  if (existsSync(createAppScript)) {
    rmSync(createAppScript, { force: true });
  }

  if (!hasPnpm) {
    const pnpmLock = join(process.cwd(), "pnpm-lock.yaml");
    const pnpmWs = join(process.cwd(), "pnpm-workspace.yaml");
    if (existsSync(pnpmLock)) {
      rmSync(pnpmLock, { force: true });
    }
    if (existsSync(pnpmWs)) {
      rmSync(pnpmWs, { force: true });
    }
  }

  // Remove chalk from package.json

  log(
    "🎉",
    "green",
    `Project setup complete! Run ${hasPnpm ? "pnpm" : "npm"} dev to launch your app!`
  );
};

main();
