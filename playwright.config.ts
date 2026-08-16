import { defineConfig, devices } from "@playwright/test";

const ci = Boolean(process.env.CI);
const productionMode = process.env.PLAYWRIGHT_PRODUCTION === "1";
let productionBaseURL: string | undefined;

if (productionMode) {
  const configuredBaseURL = process.env.PLAYWRIGHT_BASE_URL;
  if (!configuredBaseURL) throw new Error("PLAYWRIGHT_BASE_URL is required in production mode.");

  let parsed: URL;
  try {
    parsed = new URL(configuredBaseURL);
  } catch {
    throw new Error("PLAYWRIGHT_BASE_URL must be a valid HTTPS URL in production mode.");
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error("PLAYWRIGHT_BASE_URL must be an HTTPS URL without credentials in production mode.");
  }
  productionBaseURL = configuredBaseURL;
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: productionMode ? /production\.spec\.ts/ : undefined,
  fullyParallel: false,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 1 : undefined,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: productionBaseURL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: productionMode ? undefined : {
    command: "corepack pnpm@11.1.2 start --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !ci,
    timeout: 120_000,
  },
  projects: productionMode ? [
    { name: "Production Chrome", use: { ...devices["Desktop Chrome"] } },
  ] : [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] }, testIgnore: [/mobile\.spec\.ts/, /production\.spec\.ts/] },
    { name: "Mobile Chrome", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
  ],
});
