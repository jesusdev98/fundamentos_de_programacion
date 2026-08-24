# Sandbox Security

The playground is designed to reduce learner-code capabilities and preserve interface responsiveness. It is not a general-purpose untrusted-code service.

> **Educational isolation warning:** this is an educational sandbox, not a hardened security boundary for arbitrary hostile code. Its controls reduce capabilities and protect interface responsiveness, but they do not prove complete browser isolation. Anyone who controls DevTools or modifies the client bundle can tamper with execution, validation, scores, or displayed results. Do not use this design for secrets, untrusted production workloads, or anti-fraud enforcement.

Do not place secrets in the client, rely on quiz or exercise results for authorization, or reuse this runtime for hostile production workloads.

## Threat Model

The design assumes ordinary learner code may contain syntax errors, runtime errors, large output, infinite loops, accidental network calls, or attempts to inspect nearby browser APIs. It aims to keep that code away from the application DOM and network, bound execution time and messages, reject stale or forged protocol messages, and recover the parent UI from a non-responsive child.

The design does not defend against a person who controls the browser, DevTools, extensions, the downloaded client bundle, or the browser process itself. It also cannot repair browser-engine vulnerabilities.

## Isolation and Protocol

- The iframe uses `sandbox="allow-scripts"` without `allow-same-origin`, producing an opaque origin.
- The generated document applies a restrictive CSP: default and connection sources are denied; worker creation is limited to generated blob URLs.
- Parent-window messages validate the source, protocol version, per-document `nonce`, message kind, and current `connectionId`.
- After connection, execution uses a transferred `MessageChannel` rather than accepting run results from arbitrary window messages.
- Each request and result carries a unique `runId`; stale or mismatched results are rejected.
- The worker test recorder uses generated internal names and a random capability token. Learner return values do not become authoritative test results.
- The parent enables execution only after the current channel returns the validated `connected` acknowledgement.

These identifiers are capabilities and correlation values within one client session. They are not user authentication, server authorization, encryption, or durable trust.

## JavaScript Execution Controls

Each run creates a disposable Dedicated Worker. The generated runtime limits source length and retained messages, captures console output, and terminates the worker after 2500 ms. The parent has a separate 3000 ms watchdog; if the iframe does not return, React clears pending state and recreates the iframe. Completion, timeout, connection replacement, revision, and unmount paths close ports, clear timers, terminate workers, and revoke generated object URLs where applicable.

The worker shadows or disables expected network and escape-adjacent APIs, including `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `SharedWorker`, `importScripts`, and object-URL creation. Executable `import` and `export` are rejected. Nested worker creation is not available to learner code. The worker has no application DOM access; the opaque iframe itself receives no DOM capability from the parent.

## Python Execution Controls

Python practice creates a Dedicated module Worker only after the learner presses Run. That Worker imports Pyodide 314.0.4 from a pinned jsDelivr URL and initializes embedded CPython 3.14.2 before learner execution. Runtime initialization has a separate 30-second timeout. Each learner run has a 2500 ms parent timer; on expiry the application calls `Worker.terminate()`, clears pending state and timers, and creates a fresh Worker on the next run.

After bootstrap, the Worker shadows expected communication APIs including `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, and nested workers. Workers have no DOM or Web Storage. `input()` is replaced with an explicit unsupported-operation error. The runner does not call `loadPackagesFromImports`, `micropip`, or any arbitrary package installer. Practice targets the language and compatible standard library only.

These controls are capability reduction, not a perfect sandbox. Pyodide intentionally bridges Python and JavaScript, browser APIs evolve, and code can consume CPU or allocate memory until termination. The initial Worker must access the pinned CDN to bootstrap. Do not place application secrets in browser code or assume API shadowing proves that every communication path is impossible.

## Limitations

- Browser APIs and engines evolve. An unknown API or browser vulnerability may bypass assumptions.
- There is no portable browser API for a strict CPU, memory, or storage quota per worker. Malicious code can consume CPU until termination and may allocate memory before cleanup.
- A timeout bounds duration after the browser schedules the timer; it is not a real-time guarantee under severe resource pressure.
- Client-side code, scores, answer validation, IDs, capability values, and displayed results can be inspected or changed through DevTools.
- CSP and API shadowing reduce expected capabilities but do not constitute a formal proof of isolation.
- The runtime changes semantics: code runs inside an async function body, not exactly as a classic global script, and modules and DOM APIs are intentionally unavailable.
- Network denial is defense in depth, not a promise that every present or future browser communication primitive is covered.
- Pyodide runs WebAssembly in a Worker, but the browser provides no strict per-Worker CPU or memory quota. `terminate()` is the hard recovery mechanism after the parent timer fires.
- Python's virtual filesystem is session-local and does not expose the user's disk directly; it is not durable storage or a security vault.

The platform is educational, not anti-cheat. Completion state and quiz scores are learning feedback only and must not be treated as certification, fraud prevention, identity, or access control.

## Reporting

Report a suspected sandbox escape or unsafe capability privately to the repository owner before publishing reproducible details. Do not include secrets or execute tests against systems you do not own.
