# Fundamentos de la Programación

A public educational project for learning programming fundamentals through original explanations, guided practice, browser-based code execution, and reviewable quizzes. The current curriculum is focused on JavaScript and is presented in Spanish.

## About

The learning path combines theory, examples, practice, code execution in the browser, immediate feedback, quizzes, and answer review. Content is organized progressively across JavaScript Easy and Medium so learners can study a concept, apply it, and revisit the relevant lesson after a mistake.

## Features

- 46 lessons and 24 exercises across two progressive JavaScript levels.
- 100-question bank with a fresh 10-question sample per level and attempt.
- Browser playground for synchronous and asynchronous core JavaScript.
- Output-based and test-based exercise validation with feedback, hints, and solutions.
- Quiz scoring, progress, explanations, incorrect-answer review, and lesson links.
- Responsive App Router pages with reusable learning, playground, quiz, and source components.
- Official reference catalog and explicit content attribution policy.
- 12 Node tests covering curriculum invariants, quiz logic, sandbox protocol, and generated sandbox defenses.

## Current Content

| Level | Lessons | Exercises | Question bank | Questions per quiz |
| --- | ---: | ---: | ---: | ---: |
| JavaScript Easy | 24 | 12 | 50 | 10 |
| JavaScript Medium | 22 | 12 | 50 | 10 |
| **Total** | **46** | **24** | **100** | **10 per level** |

## Interactive Playground

Each exercise can run core JavaScript directly in the browser. The playground supports synchronous code, Promises, and `await` inside an async function body. It captures `console.log` output and warnings, and reports runtime errors and timeouts.

Simple exercises compare normalized output lines. More complex exercises evaluate authored assertions for equality, structural equality, or truthiness. Validation does not compare the learner's source text. The runtime intentionally does not provide DOM access, executable `import` or `export`, or expected network capabilities.

Keyboard shortcuts:

- `Enter`: run the current code.
- `Shift+Enter`: insert a line break.
- `Ctrl+Enter` or `Cmd+Enter`: run the code.

## Sandbox Architecture

`components/playground/JavaScriptPlayground.tsx` is the parent React coordinator. It creates a sandboxed iframe with scripts enabled but without `allow-same-origin`, giving the document an opaque origin. The iframe applies a restrictive Content Security Policy and communicates with the parent through a validated `MessageChannel`.

Every execution creates a disposable Dedicated Worker. The worker enforces code and output limits, restricts network and other high-risk capabilities, and is terminated after 2500 ms. A separate 3000 ms parent watchdog recovers the interface by recreating the iframe if the sandbox does not respond.

> **Educational isolation warning:** this is an educational sandbox, not a hardened security boundary for arbitrary hostile code. Its controls reduce capabilities and protect interface responsiveness, but they do not prove complete browser isolation. Anyone who controls DevTools or modifies the client bundle can tamper with execution, validation, scores, or displayed results. Do not use this design for secrets, untrusted production workloads, or anti-fraud enforcement.

## Quiz System

Each level has a 50-question bank. A quiz attempt selects 10 unique questions, shuffles both the questions and their four answers, and evaluates choices through stable question and answer IDs rather than array positions. Learners receive a score and percentage, then review incorrect answers with explanations, the correct answer, and a link to the relevant lesson. A new attempt produces a new randomized sample.

## Tech Stack

| Technology | Version | Version source |
| --- | --- | --- |
| Next.js | 16.3.1 | Exact `package.json` version |
| React / React DOM | 19.2.8 | Exact `package.json` versions |
| TypeScript | 5.9.3 | Lockfile resolution for the `^5` range |
| Tailwind CSS | 4.3.3 | Lockfile resolution for the `^4` range |
| ESLint | 9.39.5 | Lockfile resolution for the `^9` range |
| pnpm | 11.1.2 | `packageManager` declaration |

## Project Structure

```text
app/                         App Router pages and shared layout
components/learning/         Lessons, exercises, and learning-path UI
components/playground/       Editor, parent coordinator, output, and feedback
components/quiz/             Quiz flow, progress, questions, and review
components/sources/          Reusable reference links
data/javascript/easy/        JavaScript Easy curriculum
data/javascript/medium/      JavaScript Medium curriculum
data/sources.ts              Official reference catalog
lib/                         Quiz logic and sandbox protocol/document
scripts/smoke-http.mjs       Production HTTP and redirect smoke checks
tests/                       Node tests for content, quiz, and sandbox behavior
```

## Getting Started

Prerequisites:

- Node.js 20.9.0 or newer, as required by the installed Next.js version.
- pnpm 11.1.2.

```bash
git clone https://github.com/jesusdev98/fundamentos_de_programacion.git
cd fundamentos_de_programacion
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Serve an existing production build. |
| `pnpm lint` | Run ESLint across the project. |
| `pnpm test` | Run all 12 TypeScript tests with Node's test runner. |
| `pnpm verify:quiz` | Run only the quiz tests. |
| `pnpm verify:http` | Start the production server on `127.0.0.1:3100`, verify canonical routes and permanent redirects, then stop it. Run `pnpm build` first because this script uses `next start`. |

## Routes

The application exposes 11 canonical routes:

| Area | Routes |
| --- | --- |
| Home and references | `/`, `/fuentes` |
| JavaScript overview | `/javascript` |
| Easy | `/javascript/facil`, `/javascript/facil/teoria`, `/javascript/facil/practica`, `/javascript/facil/cuestionario` |
| Medium | `/javascript/medio`, `/javascript/medio/teoria`, `/javascript/medio/practica`, `/javascript/medio/cuestionario` |

Four legacy routes permanently redirect from `/javascript/basico`, `/javascript/basico/teoria`, `/javascript/basico/practica`, and `/javascript/basico/cuestionario` to their `/javascript/facil*` equivalents.

## Official References

The reference catalog in `data/sources.ts` currently uses:

- [MDN Web Docs: JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN Learn Web Development: Dynamic scripting with JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting)
- [TC39 / Ecma International: ECMAScript Language Specification](https://tc39.es/ecma262/)
- [Node.js documentation: Console](https://nodejs.org/api/console.html)
- [Node.js Learn: Output to the command line](https://nodejs.org/en/learn/command-line/output-to-the-command-line-using-nodejs)
- [MDN: iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox)
- [MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

## Content Policy

Lessons, questions, exercises, explanations, and examples are original Spanish-language material. Official documentation is consulted to verify concepts and is linked for further reading; its prose, examples, and visual design are not reproduced. Linking a source does not transfer that source's license to this project. Refer to `/fuentes` for the in-application catalog and source-specific notes.

## Disclaimer

This project is independent and is not affiliated with, endorsed by, or sponsored by Mozilla, MDN, TC39, Ecma International, Node.js, or the OpenJS Foundation. Product names and documentation links identify their respective projects and organizations. Each external resource remains subject to its own copyright and licensing terms.

The playground and quizzes are learning tools. They are not security, certification, anti-cheating, or production code-execution services.

## Roadmap

- [x] JavaScript Easy.
- [x] JavaScript Medium.
- [x] Interactive JavaScript playground.
- [x] Exercise validation and feedback.
- [x] Randomized quizzes.
- [x] Official documentation references.
- [ ] End-to-end testing with Playwright.
- [ ] GitHub Actions CI.
- [ ] Vercel deployment.
- [ ] JavaScript Advanced.
- [ ] Frontend learning path.
- [ ] Backend learning path.
- [ ] Persistent learning progress.
- [ ] User accounts.

Roadmap items describe possible future work and are not implemented commitments.

## Contributing

Bug reports, educational corrections, new exercises, and improvements are welcome as proposals and reviewable changes. Before opening a change, keep educational content original, preserve stable content IDs, cite official references where relevant, and run `pnpm test`, `pnpm lint`, and `pnpm build`.

## License

No redistribution license has been defined yet. Public repository access does not by itself grant permission to copy, modify, or redistribute the project.
