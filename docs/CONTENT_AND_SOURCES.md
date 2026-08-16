# Content and Sources

Lessons, exercises, questions, explanations, and code examples are original material written for this project. External references are used to verify concepts and give learners a path to primary documentation, not as text to reproduce.

## Source Policy

Prefer sources in this order:

1. MDN Web Docs for learner-facing JavaScript and browser explanations.
2. TC39 and the ECMAScript specification for normative language behavior.
3. Node.js documentation for Node-specific APIs and command-line behavior.

Add a source to `data/sources.ts` with a stable ID, organization, canonical URL, and accurate type. Lessons and questions reference those IDs. Use the in-application `/fuentes` page to present the catalog; do not duplicate source metadata throughout components.

Advanced JavaScript topics use focused MDN references for closures, `this`, prototypes, descriptors, classes, private elements, symbols, iteration, keyed collections, Promise concurrency, execution, modules, and `Object.freeze`. ECMAScript remains the normative language reference. Node.js event-loop documentation is used only to identify host-specific phases and priorities, not to redefine ECMAScript jobs.

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

Names such as MDN, Mozilla, TC39, Ecma International, Node.js, OpenJS Foundation, and their product or project names belong to their respective owners. This independent project is not affiliated with, endorsed by, sponsored by, or approved by those organizations.

## Copyright and Reuse

Do not copy external prose, examples, illustrations, exercise banks, or answer explanations into this repository. Short quotations should be exceptional, necessary, clearly marked, attributed, and checked against applicable terms. Prefer paraphrasing factual concepts in a new educational structure while retaining a link to the primary source.

No redistribution license has been defined for this repository. Public access alone does not grant permission to copy, modify, or redistribute its original material.
