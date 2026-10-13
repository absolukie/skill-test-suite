# Skill Test Suite

Paired delta tests for Luke's agent skills, built on the method in the primer
"New Model, Old Skills" (lukezhang.si/blog/new-model-skill-check/).

## Method

For each skill under test:

- One fixed task (a **case**) with a written rubric of binary checks, frozen before any run.
- Two arms: **without** (task only) and **with** (task plus the full SKILL.md, followed exactly).
- **3 trials per arm.** A case passes an arm only on a per-check basis; the score is checks passed.
- The number that matters is the **delta on the current model**: with-skill score minus
  without-skill score, per check and in total.
- Verdicts: delta clearly positive = KEEP. Delta about zero on checks the base model already
  passes = the prose is decoration (trim or retire). Delta negative = the skill is hurting.

Graders are deterministic first: static rubric checks on the produced file, plus a small
headless-browser pass for behavior that can be clicked (toggle flips, counter advances).

## Pilot run, 2026-10-12

Cases (one per skill, chosen because each skill carries sharp house rules a generic build
usually misses):

1. `carousel` (~/workspace/skills/carousel): build a 5-card coffee-spot carousel.
2. `ab-toggle` (~/workspace/skills/ab-toggle): build an A/B headline comparison toggle.
3. `before-after-slider` (~/workspace/skills/before-after-slider): build a before/after slider.

Outputs: `runs/pilot-2026-10-12/<case>/<arm>/trial<N>.html`
Scores: `runs/pilot-2026-10-12/results.md`

## Known limitation of this pilot

Runner agents inherit the parent conversation's context, which has seen these skills before.
That biases the without arm upward (toward a zero delta). Deltas reported here are therefore
conservative: a skill that still shows a clear positive delta under this handicap is earning
its place. A future run on a fresh model should use clean-context runners.

## Adding a case

1. Pick a skill with at least five binary, checkable rules.
2. Write the task so a competent generic build plausibly misses half of them.
3. Freeze the rubric in `cases/<name>.md` before running anything.
4. Run 3 trials per arm, grade, record per-check results, never just a total.

## Running it again (new model, new skill, any time)

This suite is wrapped as the workspace skill `skill-test-suite`
(~/workspace/skills/skill-test-suite/SKILL.md), which carries the full protocol:
frozen rubrics, clean-context runners, 3 trials per arm, deterministic grading on a
quiet machine, per-check deltas, keep/trim/retire verdicts. Invoke the skill and it
will run a fresh pass into `runs/<run-id>/` without touching past runs.
