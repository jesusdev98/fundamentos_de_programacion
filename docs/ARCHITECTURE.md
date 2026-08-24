# Architecture

The application separates a typed language catalog from a central registry of published curricula. App Router renders global discovery and reusable learning pages; quiz logic and runner protocol validation remain framework-independent so Node can test them directly.

## Request and Rendering Model

`app/layout.tsx` provides the global shell. The home page derives its three language cards from `data/languages.ts`. `data/curricula.ts` registers JavaScript and Python with their levels, sources, and runner. Both languages use `facil`, `medio`, and `dificil`; `dynamicParams = false` limits routes to those published slugs. TypeScript remains an informational hub.

| Area | Responsibility |
| --- | --- |
| `app/` | Layout, metadata, canonical routes, and legacy redirect pages. |
| `components/layout/` | Shared header and footer. |
| `components/languages/` | Shared informational hub for TypeScript while its curriculum is pending. |
| `components/learning/` | Level cards, lesson cards, exercises, code examples, and page introductions. |
| `components/playground/` | Editor, execution coordinator, console output, validation feedback, and run readiness. |
| `components/quiz/` | Attempt lifecycle, progress, question selection UI, scoring, and review. |
| `components/sources/` | Lesson-level official reference links. |
| `data/javascript/`, `data/python/` | Easy, Medium, and Difficult lesson, exercise, and question banks. |
| `data/curricula.ts` | Published curriculum registry with language, levels, sources, and runner. |
| `data/languages.ts` | Typed catalog with status, accent, sources, and totals derived from registered curricula. |
| `data/sources.ts` | Central official-source catalog associated with typed language IDs and resolved by stable IDs. |
| `lib/` | Pure quiz operations, sandbox protocol guards, and generated iframe document. |

## Routes

The application has 29 canonical routes: Home, Sources, three language hubs, and four routes per level for JavaScript and Python: overview, theory, practice, and quiz. Four `/javascript/basico*` pages permanently redirect to their `/javascript/facil*` equivalents. TypeScript has no curriculum routes yet.

## Content Model

Each published language has 24/12/50 items at Easy, 22/12/50 at Medium, and 24/14/50 at Difficult: 70 lessons, 38 exercises, and 150 questions per language. The partial JavaScript/Python total is 140/76/300. Lessons carry explanations, examples, key points, optional exercise links, and source IDs. Exercises carry stable IDs, starter code, hints, solution, explanation, and executable output or behavioral tests. Questions carry stable question and answer IDs, exactly four options, one correct option, explanation, lesson ID, and source IDs.

## Quiz Pipeline

Each level follows one pipeline:

```text
50-question bank
  -> select 10 unique questions
  -> shuffle question order
  -> shuffle each question's four answers
  -> preserve stable question and answer IDs
  -> evaluate all submitted IDs
  -> score and percentage
  -> review incorrect answers with explanation and lesson link
```

`lib/quiz.ts` copies arrays before shuffling, so a new attempt does not mutate the authored bank. `components/quiz/Quiz.tsx` blocks evaluation until every sampled question has an answer.

## JavaScript Sandbox Pipeline

```text
React coordinator
  -> sandboxed opaque-origin iframe
  -> validated window handshake
  -> MessageChannel with nonce + connectionId
  -> disposable Dedicated Worker
  -> learner code execution
  -> captured console messages + authoritative authored tests
  -> validated result with nonce + runId
  -> console and exercise feedback
```

`JavaScriptPlayground` creates the iframe from `lib/sandbox-document.ts`. The iframe has `allow-scripts` without `allow-same-origin`, applies a restrictive CSP, and transfers a dedicated `MessagePort` only after identity checks. The Run button remains disabled until the iframe acknowledges the current `nonce` and `connectionId`. Each run gets a unique `runId`; each worker is terminated after completion or timeout. A parent watchdog recreates the iframe if the child stops responding.

The generated document owns the test recorder and capability token. Learner return values and legacy binding names cannot replace the authoritative recorder output. See [Security](SECURITY.md) for the threat model and limitations.

## Python Runner Pipeline

```text
Python practice Run
  -> create same-origin Dedicated module Worker
  -> import pinned Pyodide 314.0.4 from jsDelivr
  -> initialize embedded CPython 3.14.2
  -> disable expected network capabilities
  -> execute learner code and behavioral tests inside Python
  -> capture stdout, stderr, exceptions, and test results
  -> terminate Worker on timeout and recreate it on the next run
```

No Python page creates the Worker before Run, and no landing, JavaScript, TypeScript, Python hub, theory, or quiz page imports Pyodide. Initialization has a separate 30-second timeout; learner execution has a 2500 ms hard timeout implemented with `Worker.terminate()`. Python tests execute in a separate namespace inside the runtime. The implementation never calls `loadPackagesFromImports`, `micropip`, or an arbitrary installer.

## Design Boundaries

- Curriculum data is authored separately from UI and protocol logic.
- Stable IDs, not array positions or displayed order, connect questions, answers, exercises, lessons, and sources.
- Every source belongs to an existing language; each published language lists three primary references while focused technical references remain available to lessons.
- Browser execution is a client capability; no learner code is sent to a server.
- The existing architecture favors direct data-to-component rendering over an additional service or state-management layer.
