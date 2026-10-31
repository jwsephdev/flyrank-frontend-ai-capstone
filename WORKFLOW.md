# Workflow Comparison: Vague vs. Precise Prompting

**Feature:** Settings form with validation (display name, email, bio, notifications toggle)

**Branches:**
- `settings-form-vague`: one-line prompt ("Add a settings form to my app."), output accepted unedited.
- `settings-form-precise`: plan mode, file references, constraints, example behavior, and a write-tests-then-run-them step.

## Correctness

**Vague:** [FILL: what actually worked or broke. Cite file and line. e.g. "Email is validated only on submit (`SettingsForm.jsx` L41); the name field has no required check, so an empty name submits successfully."]

**Precise:** [FILL: e.g. "Validates on blur and on submit; all rules from the spec are enforced. X of Y tests pass on first run (`SettingsForm.test.jsx`)."]

## Accessibility

**Vague:** [FILL: e.g. "Inputs rely on placeholder text with no `<label>` (L18-30); errors are plain `<p>` tags with no `aria-describedby` or `aria-invalid`; the toggle is a styled `<div>` and cannot be reached by keyboard."]

**Precise:** [FILL: e.g. "Every input has a linked label; invalid fields set `aria-invalid` and `aria-describedby`; errors use `role="alert"`; focus moves to the first invalid field on submit."]

## Edge cases

[FILL with at least three concrete cases tested on BOTH branches. e.g. whitespace-only name, email `abc`, 161-character bio, double-clicking submit, empty form submit.]

| Case | Vague | Precise |
|---|---|---|
| Name `"   "` | [accepted / rejected] | [accepted / rejected] |
| Email `abc` | [ ] | [ ] |
| 161-char bio | [ ] | [ ] |
| Double submit | [ ] | [ ] |

## Review effort

**Vague:** [FILL: minutes spent finding problems, lines changed, tests present or absent.]

**Precise:** [FILL: minutes spent reviewing the plan plus the code; number of times I had to intervene; lines changed; test count.]

## An AI mistake I caught

in the vague prompt, the ai just made up stuff and design, i guess because the prompt itself was too vague to the point that the ai needed to fill in the gaps.

## Takeaway

It wasnt the AI's fault for the vague prompt, because it was vague it was only working with what it was told and therefore needed to fill in the gaps. in future prompts need to make a proper master prompt and plan first.
