# Testing

Quality is split into three independent layers: Node tests for deterministic logic and structure, production HTTP smoke checks for routing, and Playwright tests for browser behavior. Passing one layer does not imply the others pass.

## Quick Path

```bash
corepack pnpm@11.1.2 install
corepack pnpm@11.1.2 exec playwright install chromium
corepack pnpm@11.1.2 test
corepack pnpm@11.1.2 test:coverage
corepack pnpm@11.1.2 build
corepack pnpm@11.1.2 test:e2e
```

Run `pnpm build && pnpm verify:http` to exercise the production server and permanent redirects. Run `pnpm verify` for the complete local sequence.

## Node and Core Logic

The tests under `tests/` use Node's built-in test runner with TypeScript type stripping. They cover curriculum invariants, source resolution, quiz behavior, sandbox protocol guards, result validation, and structural properties of the generated sandbox document.

`test:coverage` has an intentionally narrow scope:

- `lib/quiz.ts`
- `lib/sandbox.ts`

The command explicitly includes only those two files and enforces 100% line, function, and branch coverage. This is **core-logic coverage**, not project-wide coverage.

`lib/sandbox-document.ts` is deliberately outside that threshold. Node observes it as a string generator, so line coverage would not represent execution of the generated iframe and worker program. Its required defenses are checked structurally in Node, while actual handshake, execution, console capture, authored tests, timeout, responsiveness, and recovery run in Chromium E2E.

## HTTP Smoke

`scripts/smoke-http.mjs` starts a previously built production application on `127.0.0.1:3100`, verifies all 17 canonical routes return 200, verifies all four legacy routes return 308 with the expected target, and then terminates the server.

When `SMOKE_BASE_URL` is set, the same checks run against that HTTP(S) origin without starting a local server. External redirects may use relative or absolute locations, but must remain on the requested origin and resolve to the expected path.

## Playwright

`playwright.config.ts` uses `http://127.0.0.1:3000`, Chromium only, Desktop Chrome for the complete suite, and the official Pixel 7 Chromium device for one focused mobile spec. Local and CI runs serve an existing production build with `next start`, so run `pnpm build` before `pnpm test:e2e`. Retries and a single worker are CI-only. HTML plus console or GitHub reporting is enabled, with first-retry traces and failure-only screenshots and videos.

The current normal matrix contains 24 tests across five specs: 23 Desktop Chrome tests plus one focused Mobile Chrome test. Production mode remains a separate two-test `Production Chrome` matrix.

Tests use accessible roles, labels, names, and web-first assertions. They do not use fixed sleeps, external navigation, shared test state, or app-only answer exposure. Quiz helpers import the authored banks in test code and map the visible prompt to the correct or deliberately incorrect answer text.

E2E coverage describes verified user flows. It is not source-code coverage and does not contribute to Node's percentages.

Production verification is intentionally smaller than the local suite. With `PLAYWRIGHT_PRODUCTION=1` and an HTTPS `PLAYWRIGHT_BASE_URL`, Playwright runs only `production.spec.ts` in the `Production Chrome` project and does not start a web server. The normal `pnpm test:e2e` command continues to run only Desktop Chrome and focused Mobile Chrome tests locally.

## Scripts

| Script | Scope |
| --- | --- |
| `pnpm test` | All Node tests. |
| `pnpm verify:quiz` | Focused quiz Node tests. |
| `pnpm test:coverage` | 100% thresholds for the two explicit core files. |
| `pnpm test:e2e` | Headless desktop suite plus focused mobile smoke against an existing production build. |
| `pnpm test:e2e:ui` | Interactive Playwright UI. |
| `pnpm test:e2e:headed` | Visible-browser Playwright execution. |
| `pnpm verify:http` | Built production server routes and redirects. |
| `pnpm verify` | Core tests, coverage, lint, build, E2E, and HTTP smoke. |

## CI

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main` as a two-job DAG. `quality` installs with the frozen pnpm lockfile, then runs core tests, scoped coverage, lint, production build, Chromium installation with OS dependencies, E2E, and local HTTP smoke. `deploy-production` depends on `quality` and runs only for pushes to `main`; it deploys prebuilt Vercel artifacts, then runs HTTP and focused Playwright verification against the stable production domain. Pull requests and failed quality runs do not deploy. Playwright reports and raw test results upload only when their job fails and is not cancelled.

## Critical Flow Matrix

| Flow | Test | Spec | Desktop | Mobile | Status |
| --- | --- | --- | :---: | :---: | --- |
| 17 canonical routes | HTTP status, H1, expected content, no app error | `routes.spec.ts` | Yes | No | Automated |
| 4 legacy redirects | Exact 308 and `/javascript/facil*` target | `routes.spec.ts` | Yes | No | Automated |
| Global landing and header | Title, language states, anchor, Sources, all language hubs, global-only navigation | `routes.spec.ts` | Yes | Partial | Automated |
| JavaScript overview → levels | Link navigation and final URLs | `routes.spec.ts` | Yes | Partial | Automated |
| Easy/Medium/Difficult path navigation | Theory, Practice, Quiz links | `routes.spec.ts` | Yes | Partial | Automated |
| Sources navigation | Internal route and source catalog | `routes.spec.ts` | Yes | No | Automated |
| Easy theory | 24 lessons, examples, references, key points | `theory.spec.ts` | Yes | No | Automated |
| Medium theory | 22 lessons, examples, references, key points | `theory.spec.ts` | Yes | No | Automated |
| Difficult theory | 24 lessons, examples, references, key points | `theory.spec.ts` | Yes | No | Automated |
| Basic playground output | `Hola`, arithmetic `5`, warn, error | `playground.spec.ts` | Yes | No | Automated |
| Runtime failure | Readable `ReferenceError` | `playground.spec.ts` | Yes | No | Automated |
| Timeout and recovery | Infinite loop, responsive UI, `recuperado` | `playground.spec.ts` | Yes | No | Automated |
| Correct Easy exercise | Output, Correct, explanation | `playground.spec.ts` | Yes | No | Automated |
| Incorrect Easy exercise | No completion, feedback, hints, solution reveal | `playground.spec.ts` | Yes | No | Automated |
| Correct Medium exercise | Stable `map` authored test | `playground.spec.ts` | Yes | No | Automated |
| Correct Difficult exercise | Real closure solution, authored assertions, explanation | `playground.spec.ts` | Yes | No | Automated |
| Easy quiz | 10 unique prompts, four options, incomplete guard, result and review | `quiz.spec.ts` | Yes | No | Automated |
| Medium quiz | 10 unique prompts, four options, completion and review | `quiz.spec.ts` | Yes | No | Automated |
| Difficult quiz | 10 unique prompts, four options, review, reset, and 10/10 | `quiz.spec.ts` | Yes | No | Automated |
| Quiz repeat | Answers and score reset, ten-question attempt retained | `quiz.spec.ts` | Yes | No | Automated |
| Perfect quiz | Real-bank answers, 10/10, 100%, success, no pending review | `quiz.spec.ts` | Yes | No | Automated |
| Mobile smoke | Home, navigation, one practice run, quiz start, Difficult selector | `mobile.spec.ts` | No | Yes | Automated |
