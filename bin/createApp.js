#!/usr/bin/env node

import { execSync } from "child_process";
import { chdir } from "process";
import { join } from "path";
import ora from "ora";
import { existsSync, mkdirSync, copyFileSync, rmSync } from "fs";

const checkPnpm = () => {
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const runCommand = (command, success, error) => {
  try {
    execSync(command, { stdio: "inherit" });
    success && success();
  } catch {
    error && error();
    process.exit(1);
  }
};

const main = () => {
  // Check for required arguments

  let spinner = ora({ text: "", spinner: "dots" }).start();

  if (process.argv.length < 3) {
    spinner.fail("Please specify a project directory");
    process.exit(1);
  }

  const projectDir = process.argv[2];

  // Check for pnpm

  spinner.text = "Checking for pnpm...";
  const hasPnpm = checkPnpm();

  if (hasPnpm) {
    spinner.succeed("pnpm found!");
  } else {
    spinner.warn("pnpm not found, will use npm");
  }

  // Create project directory / clone
  spinner = ora({
    text: `Cloning into project directory ${projectDir}...`,
    spinner: "dots"
  }).start();

  if (existsSync(projectDir)) {
    spinner.fail(`Directory ${projectDir} already exists`);
    process.exit(1);
  }

  mkdirSync(projectDir, { recursive: true });

  runCommand(
    `git clone --quiet https://github.com/ividrine/modern-express-api-sql.git ${projectDir}`,
    () => spinner.succeed(),
    () => spinner.fail("Failed to clone repository")
  );

  chdir(projectDir);

  // Remove ora as dependency since its only needed for this script

  spinner = ora({
    text: "Removing unnecessary dependencies...",
    spinner: "dots"
  }).start();

  let oraRemoveCmd = hasPnpm ? "pnpm rm ora" : "npm uninstall ora --save";

  runCommand(
    `${oraRemoveCmd} --silent`,
    () => spinner.succeed(),
    () =>
      spinner.warn(
        `Unable to remove ora. You will need to run '${oraRemoveCmd}' to manually remove.`
      )
  );

  // Install dependencies

  spinner = ora({
    text: "Installing dependencies...",
    spinner: "dots"
  }).start();

  let installCmd = hasPnpm ? "pnpm install" : "npm install";

  runCommand(
    `${installCmd} --silent`,
    () => spinner.succeed(),
    () =>
      spinner.warn(
        `Unable to install packages. You will need to run '${installCmd}' manually to see full output log.`
      )
  );

  // Copy environment file

  spinner = ora({ text: "Creating env file...", spinner: "dots" }).start();

  const envExamplePath = join(process.cwd(), ".env.example");
  const envPath = join(process.cwd(), ".env");

  copyFileSync(envExamplePath, envPath);

  spinner.succeed();

  spinner = ora({ text: "Cleaning up...", spinner: "dots" }).start();

  // Remove git
  const gitDir = join(process.cwd(), ".git");
  rmSync(gitDir, { recursive: true, force: true });

  // Remove create app script
  const createAppScript = join(process.cwd(), "bin", "createApp.js");
  if (existsSync(createAppScript)) {
    rmSync(createAppScript, { force: true });
  }

  // Remove pnpm files if needed
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

  spinner.succeed(
    `Project setup complete! Run ${hasPnpm ? "pnpm" : "npm"} dev to launch your app!`
  );
};

main();
