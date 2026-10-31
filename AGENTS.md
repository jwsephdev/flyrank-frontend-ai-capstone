# AGENTS.md

## Project
Front-end portfolio site. Goal: show that I can design and build clean, functional front-end web applications, and get visitors to contact me for a job offer or interview.

## Stack and commands
- React + Tailwind CSS
- Tests: Vitest + React Testing Library
- Run dev server: `npm run dev`
- Run tests: `npm test`
- [FILL: adjust any of the above to match the repo]

## Rules

### Scope and dependencies
- Do not add new dependencies (no form libraries, validation libraries, or UI kits) without asking first. Use React state and Tailwind.
- Only create or edit the files named in the task. If another file needs to change, stop and ask.
- Follow the existing component pattern in `src/components/ContactForm.jsx` (file naming, export style, folder layout) for any new component.

### Forms and accessibility
- Every form input needs a visible `<label>` linked with `htmlFor`/`id`. Never use placeholder text as the label.
- Invalid inputs must set `aria-invalid="true"` and `aria-describedby` pointing to the error message. Error messages use `role="alert"` or an `aria-live` region.
- All interactive controls must work by keyboard and show a visible focus style. Custom toggles must use a real checkbox or `role="switch"` with `aria-checked`, never a bare `<div>` with a click handler.
- Validate on blur and on submit. On a failed submit, move focus to the first invalid field.
- Trim whitespace before validating text fields, and disable the submit button while submitting to prevent double submission.

### Verification
- After writing a feature, write tests for each validation rule and edge case (empty, whitespace-only, over-length, invalid format), run them, and show the real output before saying the work is done.
- Do not say "tests pass" unless the test output was shown in this session.
- When a spec is ambiguous or conflicts with the codebase, list the assumption in the plan instead of guessing silently.

### Workflow
- For any feature larger than one component, explore the codebase and present a plan for approval before writing code.