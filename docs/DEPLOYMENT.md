# Production Deployment

Production deployment is owned by GitHub Actions. A push to `main` must pass the complete `quality` job before the `deploy-production` job can update Vercel Production.

## Deployment Path

1. Push to `main` starts the workflow.
2. `quality` runs tests, coverage, lint, build, local Chromium E2E, and local HTTP smoke checks.
3. After quality passes, Vercel CLI pulls the production configuration, builds, and deploys the prebuilt output.
4. HTTP and focused Playwright smoke checks verify the stable production domain.

Pull requests run `quality` only. Failed or cancelled quality runs never deploy.

## Configuration

The GitHub `production` environment contains the deployment job and exposes the stable URL: [aprendeconjesusdev.vercel.app](https://aprendeconjesusdev.vercel.app).

The repository requires these GitHub repository secret names:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Never place their values in source files, workflow arguments, logs, or documentation. Rotate the access token in Vercel, then replace the corresponding GitHub secret without changing the workflow.

## Duplicate Prevention

`vercel.json` disables Vercel Git Integration deployments while keeping the repository connected. GitHub Actions is therefore the only deployment writer. Production jobs use one non-cancelling concurrency group so older runs cannot finish later and reassign the stable alias out of order.

## Verification

The deployment job checks the same 17 canonical routes and four permanent redirects used locally, but against the stable domain. It then runs two focused Chromium production tests covering the language landing and hubs, all three JavaScript learning-level routes, playground execution, and ten-question quiz invariants.

Playwright reports and raw results are retained only when production browser verification fails.

## Troubleshooting

- Missing configuration: confirm all three secret names exist and the job targets the `production` environment.
- Build failure: inspect the Vercel pull/build steps before retrying the workflow.
- HTTP or browser smoke failure: compare the generated deployment URL in the job summary with the stable domain and inspect failure artifacts.
- Token failure: rotate the Vercel token and replace only `VERCEL_TOKEN`; do not print either value.

## Rollback

Use Vercel's deployment history to promote the last known-good production deployment. Do not bypass the workflow with a manual source deployment. After rollback, verify the stable domain with the same HTTP and browser smoke checks, then fix forward through `main` and the quality gate.
