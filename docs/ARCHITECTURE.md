# Architecture

The application keeps educational content as typed data and renders it through a small set of reusable App Router components. Quiz logic and sandbox protocol validation remain framework-independent so Node can test them directly.

## Request and Rendering Model

`app/layout.tsx` provides the shared page shell. App Router pages select a level through the `facil` or `medio` slug, read the corresponding data from `data/javascript/levels.ts`, and render learning components. `dynamicParams = false` limits level routes to those two generated slugs.

| Area | Responsibility |
| --- | --- |
| `app/` | Layout, metadata, canonical routes, and legacy redirect pages. |
| `components/layout/` | Shared header and footer. |
| `components/learning/` | Level cards, lesson cards, exercises, code examples, and page introductions. |
| `components/playground/` | Editor, execution coordinator, console output, validation feedback, and run readiness. |
| `components/quiz/` | Attempt lifecycle, progress, question selection UI, scoring, and review. |
| `components/sources/` | Lesson-level official reference links. |
| `data/javascript/` | Easy and Medium lesson, exercise, and question banks. |
| `data/sources.ts` | Central official-source catalog resolved by stable IDs. |
| `lib/` | Pure quiz operations, sandbox protocol guards, and generated iframe document. |

## Routes

The application has 11 canonical routes: Home, Sources, the JavaScript overview, and four routes for each level: overview, theory, practice, and quiz. Four `/javascript/basico*` pages permanently redirect to their `/javascript/facil*` equivalents.

## Content Model

Easy contains 24 lessons, 12 exercises, and 50 questions. Medium contains 22 lessons, 12 exercises, and 50 questions. Lessons carry explanations, code examples, key points, optional exercise links, and source IDs. Exercises carry stable IDs, starter code, hints, a solution, an explanation, and either expected output or authored tests. Questions carry stable question and answer IDs, exactly four options, one correct option, an explanation, a lesson ID, and source IDs.

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

## Sandbox Pipeline

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

## Design Boundaries

- Curriculum data is authored separately from UI and protocol logic.
- Stable IDs, not array positions or displayed order, connect questions, answers, exercises, lessons, and sources.
- Browser execution is a client capability; no learner code is sent to a server.
- The existing architecture favors direct data-to-component rendering over an additional service or state-management layer.
