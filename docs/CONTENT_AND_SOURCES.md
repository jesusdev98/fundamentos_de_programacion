# Content and Sources

Lessons, exercises, questions, explanations, and code examples are original material written for this project. External references are used to verify concepts and give learners a path to primary documentation, not as text to reproduce.

## Source Policy

Use the primary official sources for each language:

| Language | Primary sources |
| --- | --- |
| JavaScript | MDN JavaScript Guide, MDN JavaScript Reference, ECMAScript/TC39 |
| TypeScript | TypeScript Handbook, TypeScript Documentation, official compiler repository |
| Python | Python 3.14 Tutorial, Python 3.14 Language Reference, Python 3.14 Standard Library |

Add a source to `data/sources.ts` with a stable ID, typed language association, organization, canonical URL, and accurate type. Language cards point to three primary source IDs; license pages are metadata rather than extra pedagogical sources. JavaScript and Python lessons may reference focused official entries. Use `/fuentes` to present metadata rather than duplicating it in components.

Advanced JavaScript topics use focused MDN references for closures, `this`, prototypes, descriptors, classes, private elements, symbols, iteration, keyed collections, Promise concurrency, execution, modules, and `Object.freeze`. ECMAScript remains the normative language reference. Node.js event-loop documentation is used only to identify host-specific phases and priorities, not to redefine ECMAScript jobs.

Python topics use the versioned 3.14 tutorial, language reference, standard library, data model, typing, asyncio, import-system, contextlib, iterator/generator, descriptor, MRO, and functools documentation. Editorial claims follow the current stable Python 3.14.7 documentation. Browser practice uses Pyodide 314.0.4, whose embedded interpreter is CPython 3.14.2; the difference is stated rather than hidden.

## Writing Rules

- Explain the concept in original words appropriate to the level.
- Write new examples that serve the lesson rather than copying documentation examples.
- Keep claims consistent with the linked primary source.
- Separate ECMAScript language behavior from browser, Node.js, or playground-specific APIs.
- Keep module syntax theoretical while the playground intentionally blocks module loading; never weaken the sandbox to make an example executable.
- Do not claim that weak collections can be enumerated or that a test can prove garbage collection occurred.
- Preserve stable lesson, exercise, question, answer, and source IDs after publication.
- Link to external material for depth instead of reproducing substantial prose, tables, diagrams, or code.

## Attribution and Licensing

Record attribution or licensing notes only when the statement has been verified against the source's current terms. A link does not transfer an external work's license to this project's original content. Conversely, this project's license status does not replace the copyright or license terms attached to linked documentation.

- MDN documentation is CC BY-SA 2.5 or any later version unless a page says otherwise. Code sample terms vary by date, so this project writes its own examples.
- The official TypeScript compiler repository is Apache License 2.0. This does not establish the license of the Handbook, documentation site, or website design.
- Python software and documentation use the Python Software Foundation License Version 2. Starting with Python 3.8.6, examples, recipes, and other documentation code are also available under the Zero-Clause BSD license.
- Pyodide 314.0.4 is Mozilla Public License 2.0. Packages distributed by or loadable in Pyodide retain their own licenses; this runner does not install arbitrary packages.

Names such as MDN, Mozilla, TC39, Ecma International, Node.js, OpenJS Foundation, and their product or project names belong to their respective owners. This independent project is not affiliated with, endorsed by, sponsored by, or approved by those organizations.

## Copyright and Reuse

Do not copy external prose, examples, illustrations, exercise banks, or answer explanations into this repository. Short quotations should be exceptional, necessary, clearly marked, attributed, and checked against applicable terms. Prefer paraphrasing factual concepts in a new educational structure while retaining a link to the primary source.

No redistribution license has been defined for this repository. Public access alone does not grant permission to copy, modify, or redistribute its original material.
