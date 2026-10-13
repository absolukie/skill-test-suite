# Pilot results, 2026-10-12

Method: one frozen task and rubric per skill, 3 trials per arm (without = task only,
with = task plus the SKILL.md followed exactly), deterministic static checks plus a
headless-browser behavior pass. Full per-check data: `grades.json`. Grader: `grade.mjs`.

## Scores

| Skill | Without (3 trials) | With (3 trials) | Delta |
|---|---|---|---|
| carousel (11 checks) | 7, 6, 6 (58%) | 11, 11, 11 (100%) | +4.7 checks |
| ab-toggle (9 checks) | 1, 0, 2 (11%) | 9, 9, 9 (100%) | +8.0 checks |
| before-after-slider (10 checks) | 5, 4, 6 (50%) | 10, 10, 10 (100%) | +5.0 checks |

Reliability view: the with arm was perfect in 9 of 9 runs. The without arm was perfect
in 0 of 9.

## What the without arm missed

- **carousel**: no generic build used snap-stop: always, overscroll-behavior-x: contain,
  or equal-height pinning (0 of 3 each). Two of three used smooth scrolling, the exact
  thing the skill bans. Counters, wrap-around, and labeled arrow buttons were already
  baseline behavior.
- **ab-toggle**: every generic build reached for a two-button segmented control, which
  violates the skill's core contract (one switch, every tap flips). None used role=switch,
  overshoot easing, reduced-motion handling, or a both-sides aria-label (0 of 3 each).
- **before-after-slider**: generic builds got the ARIA shell, pointer capture, and
  touch-action right, but none clamped travel to 2..98, none had tap-to-glide or the 6x24
  notch, and their keyboard steps were 1 to 2 percent with Home/End going to 0 and 100
  instead of the clamped 2 and 98 (measured sequences: 50, 52, 100, 0).

## Verdicts

- **carousel: KEEP.** Delta +4.7 checks, concentrated in exactly the no-shift, no-bounce
  rules Luke commissioned it for.
- **ab-toggle: KEEP, the standout.** Delta +8.0 checks. Without the skill the model builds
  a different component than the one Luke asked for in 2026-10-05.
- **before-after-slider: KEEP.** Delta +5.0 checks; the skill's value is in the interaction
  details (clamp, glide, notch, exact keyboard steps), not the basic slider shape.

## Honesty notes

- Runner agents inherit the parent conversation, which had seen these skills; that biases
  the without arm upward, so these deltas are conservative.
- Three grader bugs were found by auditing surprising results against the files and fixed
  before the final run (a font-smoothing false positive on the no-smooth check, a
  role=switch count that included a JS string, and a flip-back check with a broken
  baseline). Rubric meanings never changed; only measurement errors were corrected.
- Behavior checks flaked twice under heavy parallel load (18 trial agents plus a research
  run); the canonical scores above are from a final quiet-machine run, and the toggle and
  slider behaviors were additionally confirmed by hand in isolated debug runs.
