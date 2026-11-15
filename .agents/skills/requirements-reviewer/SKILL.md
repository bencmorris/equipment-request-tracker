---
name: requirements-reviewer
description: >-
  Compare a feature specification against its implementation and report whether
  the code actually satisfies the spec before the change is accepted. Use when a
  feature was built from a written spec (for example docs/*-spec.md) and someone
  needs to confirm the acceptance criteria are met. Reports satisfied criteria,
  gaps, unsupported behavior, data/security concerns, and tests still needed,
  citing evidence from both the spec and the code. Does not change files unless
  explicitly asked.
scope: repository
---

# Requirements Reviewer

A review workflow that checks whether an application change actually matches its
specification before the change is accepted.

## When this Skill applies

Use this Skill when:

- A feature was built from a written specification (such as a file under
  `docs/` ending in `-spec.md`), **and**
- You need to decide whether the implementation satisfies that specification
  before merging or accepting the change.

Do **not** use this Skill to design features, write new specifications, or make
code changes on your own. This Skill reviews; it does not build.

## Evidence to examine

1. **The specification.** Read every section, but treat the **Acceptance
   Criteria** as the contract. Also read Functional Rules, Constraints, and
   Out of Scope.
2. **The implementation.** Read the source files that implement the feature
   (markup, styles, and logic). Trace each acceptance criterion to the exact
   code that is supposed to satisfy it.
3. **Existing tests or verification notes.** Check for automated tests and any
   "Verification Results" section. Note whether the evidence is automated or
   manual.
4. **Data and persistence paths.** Note where data is read, written, stored, or
   rendered, and whether untrusted input reaches the DOM, storage, or a network
   call.

## What to report

Produce a written report with these sections. Every claim must cite evidence —
quote or reference the spec section/criterion and the specific file and code it
refers to.

1. **Summary** — one or two sentences: does the implementation meet the spec?
2. **Satisfied acceptance criteria** — each criterion that is met, with the code
   that satisfies it.
3. **Gaps** — acceptance criteria, functional rules, or constraints that are
   unmet, only partially met, or not observable/testable as written.
4. **Unsupported behavior** — behavior in the code that the spec does not call
   for (scope creep, or anything contradicting Out of Scope).
5. **Data or security concerns** — storage, input handling, rendering, or
   network risks (for example unescaped user input, unguarded parsing).
6. **Tests still needed** — the checks that should exist (automated or manual)
   before the change is accepted, tied to specific criteria.

End with a short, prioritized list of findings, most important first.

## Rules

- **Do not change any files unless explicitly asked.** The default output is the
  report only.
- Do not assume a criterion is met because the code looks related — confirm the
  behavior it produces.
- Cite evidence for every finding. A finding with no spec or code reference is
  not a finding.
- Flag criteria that are untestable or unobservable as written, even if the code
  "looks right."
- Keep the review focused on the spec under review; do not expand scope.

## Invocation

```
$requirements-reviewer Review <feature> against <path/to/spec.md>. Do not change files.
```
