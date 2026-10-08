# Phase 1 / checkpoint 1A: role view model

Status: data layer only. No page loads this module yet. No HTML, CSS, navigation, selection or expand/collapse events are changed.

## API and boundaries

`RoleViewModel.createAdapter(api)` returns `normalizeRole(roleRecord)`. CommonJS consumers use `require('../js/role-view-model.js')`. Browser consumers receive the `RoleViewModel` namespace; loading it does not initialize anything.

Inject `roleList`, `costList`, `getRoleScoreConfig`, `getScoreDetails`, `countScores`, `countMainAttr`, `countMainAttr2` and `getRoleEnergyCorrection` from the existing scoring module. There is no DOM reference, jQuery call, storage access, event binding or network request in the adapter. The input is cloned before legacy scoring functions receive it. The result contains only detached, JSON-serializable data.

The caller owns loading/saving and interaction state. Do not store this derived model in `mcData`. Do not put `selectedSlot`, DOM IDs, class names or renderer callbacks in it.

## Result

- `schemaVersion`: version of this derived contract, not the save-file schema.
- `role`: instance/catalog IDs, name, imported/manual source, optional level and legacy portrait path.
- `model`: availability, effective clamped chain, requested mode/extra energy, detached resolved scoring configuration. Requested mode is deliberately not presented as a verified effective mode.
- `slots`: always five positional entries. Each has a position-based key, position, status and optional echo.
- `slots[].echo`: identity, catalog/image, Cost, raw set name or icon, normalized main/substats, opened count and score components.
- `substats[]`: canonical property, numeric value, `%`/`flat` unit, validation status, raw input, rounded/raw contribution, coefficient and score status.
- `effectiveCount`: positive unrounded model contributions, before whole-loadout energy correction. It is not a count of guaranteed marginal benefits in the full build.
- `positiveContributionCount`: positive *display-rounded* contributions; retained separately so rounding is explicit.
- `score`: value, main plus fixed attribute contribution, substat subtotal, cached score for diagnosis, and scope.
- `scale`: common score-points domain starting at zero, at least 100; expands in tens if a real contribution exceeds 100. This is a shared role-score contribution scale, NOT a per-Echo 100-point quality rating. No per-slot normalization or clamping.
- `summary`: completion status, recomputed score, cached score, known subtotal, separate energy correction, Cost total, known substat totals and weakest positions (including ties).
- `issues`: unavailable model, missing loadout, excess slots, duplicate instance IDs, incomplete slots or exceeded Cost budget.

## Manual/import normalization

Manual `mainAtrri` strings are parsed only if the existing `countMainAttr` explicitly supports them. For example `攻击18%` becomes property `大攻击`, value `18`, unit `%`. Unknown strings are unavailable, rather than inheriting the old calculator's fallback to its fixed stat.

Imported `mainAtrri` objects already contain canonical property names and are validated into the same shape. `%`-style canonical fields may contain a numeric value without the suffix; their unit comes from the canonical name. Flat stats with a percent suffix are invalid. Unknown names are unsupported, not zero-weight stats. No new raw-API alias mapper is introduced; this adapter consumes the project's stored records.

Set strings and icon URLs remain distinct. A URL is not interpreted as a set name. Imported catalog IDs can differ from the local catalog; retain explicit name/image when supplied, otherwise leave unavailable metadata null.

## Scoring

`base.js` extracts `getScoreDetails` from the existing `countScores` body. The coefficients, normalization arithmetic and two-decimal output are unchanged. `countScores` remains the compatible rounded wrapper, including its existing invalid-input alert behavior. The details function itself returns null for absent arguments without alerting.

Manual main contributions call `countMainAttr`. Imported ones call `countMainAttr2` for fixed attributes plus `countScores` for the variable main stat. Substats use the same calculation through `getScoreDetails`. Per-Echo sums follow legacy rounded contributions. The whole-loadout energy correction is calculated once and kept separate; it is not assigned to an arbitrary slot. Existing `sumScores`/`totalScore` are diagnostic cached values only, never used as authoritative fallback.

Missing/invalid input, fewer than five populated slots, fewer than five recorded substats, excess slots, duplicate IDs or Cost overflow prevent a complete overall score and weakest-slot recommendation. Available per-Echo values and known substat totals remain inspectable. Four recorded substats mean incomplete data; they do not prove that the fifth is unopened in the game.

## Stable slots and limitations

Input order is preserved exactly; there is no Cost sort. Position keys are stable within this baseline snapshot. They are not persistent equipment slot IDs. Do not infer active/main Echo from position 01. Future integration must avoid calling the legacy in-place sorter before constructing a baseline if original ordering matters.

Imported IDs can be regenerated on refresh, so cross-import selection/history cannot rely on `costId` alone. Explicit main-Echo identity, trustworthy update time and complete set metadata are not available uniformly. Art maps and selection restoration belong to later work.

Energy thresholds are loadout-dependent. A positive base coefficient may have no additional marginal value after the whole-build correction; the view model's count is explicitly scoped and must not be labeled a replacement recommendation.

The original fixed main-stat assumptions (Cost1 HP 2280, Cost3 attack 100, Cost4 attack 150) are retained through legacy APIs. Imported item level is not consistently available. Scores here inherit those assumptions and are not a new level-aware scoring system.

## Validation

- `node tests/role-view-model.test.cjs`: 60 actual scoring-model combinations with constructed manual/import records; parity, immutability, stable order, rounding, stale cache, missing/unknown/invalid fields, duplicates, excess slots, Cost overflow and browser export without DOM/storage.
- `node tests/character-chain-scoring.test.cjs`: existing 42-profile regression suite.
- `node tests/new-character-scoring.test.cjs`: existing 91-profile regression suite.

These are deterministic fixtures using production formulas, not a claim of live game-account import verification. Checkpoint 1B remains unstarted.
