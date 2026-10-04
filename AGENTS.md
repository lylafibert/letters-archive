# AGENTS.md

Guidance for AI coding agents working on this repository. Read this first,
then [`README.md`](README.md) for an overview and [`docs/design.md`](docs/design.md)
and [`docs/dates.md`](docs/dates.md) before changing the data model or dates.

A static digital edition of fictional nineteenth-century letters. SQLite is
the source of truth, and a build script renders it to accessible HTML with
React, sending no JavaScript to the browser.

## Commands

Node 24 (`nvm use`).

- `npm run check`: lint, type check, formatting and all tests. Must pass before a change is done.
- `npm run build`: rebuilds the database, then writes the site to `dist/`.
- `npm run db:reset`: rebuilds `data/archive.sqlite` from the migrations and seed data.
- `npm run format`: applies Prettier.
- `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`: the checks one at a time.
- `npx vitest run <path>`: runs one test file.

## Roles

The developer owns the decisions. The agent does the work and makes the
decisions visible.

**The developer decides:** the data model and schema, scope, new
dependencies, anything a visitor reads (page copy, the README), and anything
that changes git history.

**The agent:** implements agreed changes, writes the tests, runs the checks,
reviews its own work against this file and reports back honestly.

## How to work

1. **Understand before changing.** Read the relevant code and docs. If the
   request is ambiguous, ask one clear question rather than guess.
2. **Surface decisions, don't make them silently.** When there is a real
   choice (a design, a library, a name that will spread), set out the
   options, their trade-offs and a recommendation, then wait.
3. **Keep changes small and focused.** One purpose per change. Don't refactor,
   reformat or "tidy" code the task doesn't touch. Mention it instead.
4. **Prove it works.** Run `npm run check`, and the build for anything that
   affects the site. Report the actual output. Never say something passes
   without running it.
5. **Report briefly.** What changed, why, what was checked, and anything
   left open or worth a follow-up.

Challenge the developer when a request conflicts with best practice, and
explain why. Agreeing to be agreeable is not useful.

## Boundaries

**Always**

- Prefer an established standard or a maintained library over custom code.
- Add or update tests with every change in behaviour, and a test for every bug fix.
- Keep docs in step with the code they describe.

**Ask first**

- Changing the schema, an existing migration's meaning, or the seed data.
- Adding, removing or upgrading a dependency.
- Changing page copy, the README or the licence.
- Committing or pushing. Commit messages use `type: Imperative summary`, e.g. `fix: Escape transcription text`.

**Never**

- Rewrite history, force-push or delete files unless explicitly asked.
- Edit generated files: `dist/` and `data/archive.sqlite`.
- Edit a migration that has been released. Add a new one.
- Invent, complete or "correct" historical sources, or add real personal data.
- Commit secrets, or add network requests to the build.
- Leave a long-running process behind. Wrap browsers and servers in `timeout` and stop them when done.

## Research integrity

- Transcriptions are verbatim, including spelling. All people, places and letters are fictional.
- Record uncertainty as evidence, never as a guess: keep the source's wording (`date_text`), where it came
  from (`date_source`) and an EDTF value. Derive ranges with `edtfToRange`, never by hand.
- Use open standards: EDTF (ISO 8601-2) for uncertain dates, ISO 8601 for exact ones.

## Code

- One responsibility per file. Split by testable responsibility, not line count.
- Names say exactly what a thing is or does. Clear code over clever code. Delete what isn't needed.
- Arrow functions assigned to `const`, with helpers above their callers (enforced by ESLint).
- Prefer `const`, early returns and array methods. No nested ternaries.
- No unnecessary casts, and no non-null assertions outside tests.
- Fail loudly on broken invariants. Never hide missing data behind a silent default.
- Comments explain why, not what. No comments that only make sense with today's context.

## Tests

- Unit tests sit next to the code they test. Integration tests live in `tests/integration/`.
- Test behaviour, not implementation, with fixed expected values. Cover every branch.
- Name tests as present-tense statements of behaviour, without "should".
- Query components by role and accessible name.

## Accessibility

- WCAG 2.2 AA is the minimum, as required of UK public sector bodies. Aim for AAA contrast on text.
- Semantic HTML first. Use ARIA only where HTML has no equivalent.
- Every page works with a keyboard, a screen reader, zoom to 400%, dark mode and no JavaScript.
- The build test validates every page with `html-validate`. For visible changes, also run
  Lighthouse's accessibility audit and report the score.

## Writing

Applies to docs, comments, commit messages and replies.

- Plain British English. Short sentences and every line earns its place.
- No semicolons in prose. No filler or AI-sounding phrasing.
- Don't write things that go stale, such as hardcoded lists or line numbers. Link to the source of truth.
