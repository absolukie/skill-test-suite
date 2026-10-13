# Case: ab-toggle

Skill under test: `ab-toggle` (~/workspace/skills/ab-toggle/SKILL.md)

## Task (identical wording both arms)

Build a single self-contained HTML file: an A/B comparison for two hero headlines,
A: "Coffee, delivered weekly" and B: "Never run out of beans", with a toggle control above
a stage that shows the active version's headline and a one-line description. No external
resources, no libraries. Write the file and stop.

## Rubric (9 binary checks, frozen 2026-10-12 before any run)

1. Exactly one toggle control: a single `<button>` with `role="switch"`.
2. No side-picking: there is no second button that selects A or B directly (grader: count buttons whose text is a side label or that set a fixed side).
3. `aria-checked` on the switch, and it flips when the button is clicked (behavior check).
4. Every tap flips: clicking while B is active returns to A (behavior check, two clicks restore the initial side).
5. Sliding thumb: an element that moves between the left half and `left: 50%` (or translateX equivalent) to indicate the shown side.
6. Thumb transition uses an overshoot easing (a cubic-bezier with a control point above 1, e.g. 1.15) or a spring-like equivalent.
7. Stage crossfade: the two versions are stacked layers whose opacity toggles with a transition of roughly 400 to 500ms.
8. `prefers-reduced-motion` is handled (transitions disabled or reduced under the media query).
9. `touch-action: manipulation` on the toggle, and an aria-label naming both sides.

## Behavior spot-check (browser)

Initial aria-checked is "false"; after one click "true" and the visible headline is B's;
after a second click it returns to A.
