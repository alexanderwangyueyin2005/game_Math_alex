# Array Architects — quiet kinetic workshop (v0.5.0)




## Latest: visual + motion system (v0.5.0)

This pass changes the presentation and motion boundary of the same game. Challenge pool, adaptive engine, telemetry schema and CSV remain unchanged. Files: `array-architects.js`, `index.html`, `package.json`, `tests/motion.test.cjs`, this README.

### One operation surface

A forest-green instrument rail sits above an ivory/sage working field. The math relation is attached to the field rather than floating below another card. On wide screens the token tray sits to the left of the equal-group lanes; on narrow screens it moves beneath them. Guide steppers and the four-tooth sharing tool are embedded in the stage. The tray keeps its footprint while objects leave, so it does not collapse mid-action. Input slots and part labels use the same soft, asymmetric tool shape.

### Physical tokens

Each existing keyed token now contains a `.bead` body. The parent supplies an independent elliptical contact shadow; the body has a muted directional clay color, small upper-left highlight, inner rim and underside shading. A 40px interactive footprint contains a 32px body. Lift changes body position and shadow separately; landing briefly compresses them without overshoot. Tokens retain their keys through placement, sharing, split and join.

### Motion contract

Sharing/placement/return: lift 120ms → travel 620ms → settle 180ms → update counts, persist state and emit the existing control event. During travel, destination geometry is previewed while the logical allocations remain uncommitted. A refresh or interrupted transfer therefore restores the last settled state, not a half-recorded move. Repeated actions are guarded while a transfer runs. Reduced motion uses the same commit boundary with zero travel durations.

Split: the original rows separate by 16px vertically and 10px laterally; no replacement array is rendered. Boundaries appear after a short observation window, and the divider fades to a quiet trace. Part labels identify the regions in addition to color.

Join: the existing partial-product number elements move from their region labels into the addition line. The original tokens converge. Those same number elements are retained in the sum prefix; the total appears and stays mounted while the multiplication prefix enters. Successful completion updates the progress rail and gives a 750ms settling interval before Continue becomes available.

The helper motif is an asymmetric clay tab with two tiny eyes. The shape recurs in Guide/hints, recommended split handles, tool surfaces and completion marks. An idle helper appears briefly and dismisses on interaction; it does not remain as a mascot.

### Verification

19 automated tests pass, including five new motion checks covering confirmation ordering, duplicate-click guards, conservation on return, interrupted travel and reduced motion. Browser acceptance completed all six challenges and Summary at desktop/tablet sizes, plus Build and Split Guide at 390px. Observed sharing: four moving nodes while the display still read 24 remaining, then 20 only after landing. The final Join was visually checked at 28 + 14 = 42 and again at 8 × 6 = 48. Keyboard activation, stale-feedback clearing, Show how interruption, and persisted placement after refresh worked. Browser error logs were empty. Document width equaled viewport width at 768px and 390px; the normal narrow Build field did not overflow either.

The second visual pass removed the empty Guide equation strip, joined the working field and equation surface, quieted nonrecommended split handles, increased tray-token contrast, and fixed a transient numeral overlap by reserving equation positions before motion. QA ran on a separate local port so the original player's saved progress was preserved.

No new blocking bug observed. Reduced-motion behavior is covered by the motion tests and CSS; an OS-level reduced-motion browser pass was not performed. Extremely uneven Build allocations use an internal horizontal scroller; simultaneous tabs editing one session remain unsupported. This is still the standalone local MVP, not an integration into the unavailable GitHub application.

## Previous: tactile playground visual pass

Changed `array-architects.js`, `index.html`, `package.json` and this README. No dependencies, new routes or changes to challenge rules, telemetry schema or adaptive policy.

The visual language is a quiet tabletop: warm neutral surfaces, moss/mineral-blue tokens and a folded-corner marker. A tiny two-dot guide glyph appears in tutorial and hint text; split handles and completion marks share its asymmetrical silhouette. Tokens remain plain mathematical objects.

Tokens increase from 21px to 26px with a restrained radial highlight, inset edge and contact shadow. Hover lifts a returnable token 2px. Placement compresses its shadow. Existing keyed token nodes continue to move from pool to rows using a 480ms eased transform; sharing retains synchronous distribution. Row spacing and sharing +1 positions were updated together. Pool and rows now have quiet recessed trays.

Challenge headings align to the central stage axis. The stage has a light mineral surface and inner depth. Answer slots, part chips and the action strip use an inset tool language. Split boundaries reveal after a short 450ms anticipation, with the entry attention cue at 500ms; reduced-motion mode keeps the boundaries visible without animation. The prior approximately three-second join sequence and staged inverse reveal are preserved.

Validation: JavaScript syntax check and all 14 existing tests pass. Browser play completed Build and Split Guide, both Build tasks, six sharing actions, all three split tasks and Summary. Split/Join was also played with a 768px viewport override. Browser error logs were empty. No new blocking bug observed. Narrow phones and extreme uneven token allocation still need dedicated layout testing; simultaneous-tab persistence remains unsupported.

Next priorities: observe learner discoverability of the new split handles; tune stage density across small screens; connect this standalone component to the actual Logifera application/design tokens.

## Previous: restrained motion polish

Only `array-architects.js`, `package.json` and this README changed in this round. Game rules, storage, telemetry and adaptive policy are unchanged; no dependencies were added.

- Attention uses one soft 900ms pulse, peaking at scale 1.035 with a faint 3px ring. Plus hover peaks at 1.04. Entry and one idle reminder remain; clicks, edits and submissions immediately dismiss the cue and cancel its pending idle reminder. The Guide control no longer pulses indefinitely.
- Math reveal uses a shared 420ms fade with a 3px settle; completion and placed dots settle from scale .985 without overshoot. Reduced-motion preferences remain supported.
- Formal Split and Guide share the same sequence: first partial at 0ms, second at 300ms, plus at 600ms, parts converge at 900ms, sum/result at 1500ms. After the result's 420ms reveal and a 550ms hold, the addition prefix fades out and the original multiplication prefix enters over 550ms. The total stays mounted and in position. Continue/Start becomes available at approximately 3020ms.
- Build captions now read “Rows now: 3, 3, 3, 3, 2”.

Verification: all 14 existing tests pass; browser play completed six challenges and the Build → Split Guide. The intermediate sum/result was visually checked, final equations and navigation worked, cue dismissal was checked after a plus click, and browser error logs were empty. No new blocking bug observed. Fixed pacing, concurrent-tab persistence and narrow-phone layout remain existing limitations; this round did not broaden device coverage.

## Previous round: make the process legible

The existing layout and game flow are retained. This round modifies `array-architects.js`, `telemetry.js`, `package.json`, `tests/telemetry.test.cjs`, this README and `sample-session.csv`. It adds no dependency, route or new system. `index.html`, the server and adaptive policy are unchanged.

### Motion rhythm and mathematical sequence

Named constants: fast emphasis 200ms, normal transition 340ms, math emphasis 800ms, short stagger 300ms. CSS respects reduced motion while retaining readable timed steps.

Join timeline now follows the v0.3.1 sequence above (superseding the original round-3 timing). Inputs/actions are guarded during the sequence, so an early click cannot skip it. Guide uses the same join sequence; its initial two subfacts also enter in 300ms steps rather than appearing at once.

Inverse timeline: multiplication first → bidirectional symbol at 450ms → division at 800ms → explanatory feedback at 1200ms. The explanation is absent until the equations finish.

### Affordances

- Row boundaries have small handles and clearer hover/pressed states. The recommended boundary is always marked before choosing a split; all other valid boundaries remain available.
- First Build plus button and the equal-sharing button receive one entry cue. Split boundaries receive the same cue.
- An additional one-shot cue occurs after 2.5 seconds with no click/input. Cues do not loop; per-challenge cue flags persist across refresh.
- Plus buttons have subtle rings, hover and pressed states. A placed dot gently settles. Sharing shows four synchronous +1 labels as existing dots move; remaining objects update in the same action.

### Optional Show how

Each unsolved partial has its own Show how button. It highlights one corresponding array row at a time and builds a skip-count sequence, e.g. 6 → 12 → 18. Each row receives 640ms; the result is never filled into the input automatically. Students who solve independently do not need to open it.

Feedback recommends Show how after a mistake and repeated counting after another. Editing an input cancels the demonstration and clears stale feedback. Changing a split cancels its old demonstration. Opening support is recorded even if interrupted; completion is recorded only when the last row has been shown. Storage restores the support usage record, but an interrupted animation must be reopened rather than resuming halfway.

### Additional telemetry / CSV

Events: `attention_cue_shown`, `support_opened`, `support_completed`. Cue payloads include `attentionCueShown`, `cueType`, `trigger` (entry/idle) and the specific `splitCueShown`, `addOneCueShown` or `plusDotCueShown` flag. Support events include related partial, `supportType: skip_count`, and opened/completed status.

Challenge summaries and CSV add: `selectedSplit`, `partial1Attempts`, `partial2Attempts`, `partial1Outcome`, `partial2Outcome`, `supportUsed`, `supportType`, `supportCompleted`, and cue flags. Summary aliases `strategySupportUsed` and `strategySupportType` are also retained in the JSON record. Partial outcomes distinguish `independent`, `correct_after_support` and `correct_after_retry`. Support is counted by the existing adaptive scaffold policy; auto-produced totals are still not recall evidence.

Existing v2 localStorage sessions are preserved with additive fields. Older records have blank new CSV columns; no past strategy is inferred. Attempts count each checked field on every submission, including a resubmitted correct field.

### Round 3 verification and limits

14 automated tests pass. Browser checks completed the six-task session, both partial support buttons, wrong-answer editing, Guide sequencing, synchronous four-group sharing, and all sequential formulas. Recorded browser observations: join showed only 30 initially, then 12, then +, then 42, then 7×6=42; inverse feedback remained absent until both equations appeared. Browser error logs were empty. Actual CSV download was parsed to verify support/cue records and per-part outcomes.

No new blocking bug was observed. Remaining limits: timings are fixed rather than learner-controlled; active animations restart from a safe saved step after refresh; concurrent tabs remain unsupported. P2 active-step emphasis and closer spatial mapping of partial cards were not added. Next priorities: learner testing of pace and discoverability; replay/learner-paced explanations; closer mapping of partial cards to array regions.

Direct revision of the existing dependency-free MVP. Same custom element, page, white card, palette and five stages. No new package dependency or project scaffold.

## Play

Open `index.html` with the three JavaScript files alongside it, or run `npm start` and visit http://127.0.0.1:4173. Node.js 18+ is only needed for the optional local server and tests. Prefer localhost for reliable localStorage behavior. No API, network connection or account is required.

Refreshing now restores the active session: selected split, inputs, feedback, history and learner state. A completed session restores its summary. Play again starts a new session through the introduction and both guides, preserving older records.

## Revised interactions

- Build Guide: construct 3×4. Then a required Split Guide shows 6×4. Tap the highlighted boundary after five rows, see 5×4=20 and 1×4=4, and join the parts to reveal 24 before formal play.
- Formal Build: make 12 with three equal rows, then 15 with five equal rows. No factor-copying steppers. Place dots using the controls inside each row; tap a placed dot to return it to the pool. The total object count is conserved.
- Inverse: “Share 24 into 4 equal groups / How many will be in each group?” Each press of Add one to each group moves four existing dots. Remaining counts are 24, 20, 16, 12, 8, 4, 0. Completion shows both 24÷4=6 and 4×6=24.
- Split, including the 8×6 transfer task: select a boundary in the array → enter both partial products → validate both → Join the parts → system derives the final product. **No final-total input exists.** Any internal row boundary is valid. Changing the split invalidates previous answers.
- Keyed dots move with CSS transforms. The addition appears before the combined product. Reduced-motion preferences remain respected.
- Smaller consistent challenge titles; amber feedback next to affected inputs; green feedback only for successful checks.

## Feedback

`feedbackState` is keyed by `partA`, `partB`, `array` or `split`. Records contain `type`, `feedbackType`, `attemptNumber`, `scaffoldLevel`, `relatedField`, `message`, `timestamp`.

Wrong subfacts escalate:

1. Identify the relevant rows and dots per row, without giving the product.
2. Show the corresponding repeated addition.
3. Show cumulative totals in the message **and alongside the actual rows**.

The relevant region pulses. Editing its input immediately removes stale feedback, invalid styling and cumulative labels. Changing a split clears old answers and feedback. Explicit hints are logged separately and count as scaffolding.

`selfCorrected` requires successful completion after an incorrect response, feedback and a related response change. `independentSuccess` requires no errors, requested hints or supplied scaffolds. A submission checks both subfacts as one attempt. `subfactAccuracy` is correct subfact checks divided by all subfact checks; a resubmitted correct field is counted again.

## Unified telemetry

All storage/CSV logic lives in `telemetry.js`. `Telemetry.logEvent(eventName, payload, context)` is the unified boundary. Storage is injected so a future backend adapter can replace localStorage without spreading storage calls through the component.

Every event contains `sessionId`, ISO `timestamp`, `challengeId`, `challengeType`, `skill`, `eventName`, `attemptNumber`, and structured `payload`. Challenge context is null when not applicable.

Implemented events: `session_started`, `principle_completed`, `guide_step_completed`, `challenge_started`, `control_changed`, `split_selected`, `subfact_submitted`, `answer_submitted`, `feedback_shown`, `answer_changed_after_feedback`, `hint_requested`, `challenge_completed`, `adaptive_decision`, `session_completed`.

Each completed challenge contains:

`challengeId`, `challengeType`, `skill`, `factors`, `firstTryCorrect`, `independentSuccess`, `finalSuccess`, `attemptCount`, `hintCount`, `highestScaffoldLevel`, `selfCorrected`, `selectedSplitStrategy`, `subfactAccuracy`, `completionTimeMs`, `completedAt`, `incorrectAttempts`, `policy`.

Completion time includes idle/background time and is only descriptive. Neither selection nor mastery uses it. No speed score, punishment or ranking exists.

Keys use `logifera.array-architects.v2.*`, one record per session plus an active pointer. Replay preserves older sessions. Storage denial/quota errors leave an in-memory, exportable session and a visible notice under Session tools. Records remain local to the browser/device/origin; nothing is transmitted. Concurrent tabs modifying the same active session are not supported.

## Export CSV

Expand **Session tools → Export session data**. Export includes all locally saved sessions, with separate `event` and `challenge_summary` rows. Columns cover identity, timestamp, challenge, attempt, feedback type/level/field, split, independent/final success, self-correction, hints, accuracy and completion time. Full payloads are retained as JSON. UTF-8 BOM, quoting and spreadsheet formula-prefix escaping are included.

`sample-session.csv` is an **actual exported browser QA run, not student data**: 249 events and 12 challenge summaries across 2 test sessions. It includes all 14 event types. The 3+4 split completed after level-three scaffold with `independentSuccess=false`, `selfCorrected=true`; the first Build completed independently.

## Adaptive Engine v1

`selectNextChallenge(learnerState, history)` reads the expanded summaries:

- Independent successes without hints/scaffold can increase complexity by one step.
- Level-two-or-higher support prioritizes a supported same-skill transfer.
- Two weak outcomes retain that skill with an anchor.
- Confident equal grouping prioritizes the inverse relationship.
- Every session retains the six unique core tasks.

Signals separate `productRecall`, `decomposition`, `equalGroups`, `inverseRelationship`, with the previous `arrayConstruction` compatibility field. Automatically generated final products are not credited as independent recall. Strongly scaffolded decomposition gains only a small practice increment even when the final products are correct. These are internal practice signals, not diagnostic scores.

## Tests and observed results

Run `npm run check` and `npm test`.

14 automated tests passed: coverage, inverse priority, independent progression, hint/scaffold transfer, weak-process mastery, timing independence, storage recovery, session retention, CSV schema/escaping and storage failure.

Browser checks at 1280×900 and 768×1024 covered all ten requested cases:

1. Build Guide really enters Split Guide.
2. No answer input before selecting a split; 42 entered as an incorrect partial product cannot bypass the process.
3. Split → both subfacts → Join → automatic final product.
4. First error gives level-one feedback next to its field.
5. Editing clears the stale message immediately.
6. Subsequent errors produce levels two and three, including visual row totals.
7. Correct inputs receive green feedback and unlock Join.
8. Refresh restores split, inputs and feedback; adapter tests verify saved events persist.
9. CSV was actually downloaded and parsed: all 14 event types and six complete summaries verified.
10. A scaffolded split selected a supported decomposition transfer.

Both Build tasks, all six equal-sharing presses, all three Split tasks and the final summary were completed. Browser error logs were empty.

## Files

Modified: `index.html`, `array-architects.js`, `adaptive-engine.js`, `server.cjs`, `package.json`, `tests/adaptive-engine.test.cjs`, `README.md`.

Added: `telemetry.js`, `tests/telemetry.test.cjs`, `sample-session.csv`.

## Integration / limits

This remains the standalone MVP from round 1. The actual GitHub repository and current Dyslexia Screener container were unavailable then; these files have not been integrated into that repository. No other project was changed.

Load scripts once in order: `adaptive-engine.js`, `telemetry.js`, `array-architects.js`, then mount `<array-architects>`. The component owns its white card; its host owns width/navigation. CSS custom properties remain available for colors. `challenge-complete` and `session-complete` events now return expanded records. `game.getSession()` returns the current session, events, summaries, snapshot, learner state and history.

Deferred: another grouping of the same 12, free-drag divider, larger transfer pool, Progress Dashboard, backend/sync and exact current Logifera integration. If the finite pool has no remaining same-skill item, selection falls back to the next core task. Narrow phones and extreme uneven allocations need more layout testing; this round verified laptop/tablet.

Next priorities: observe learners using the arrays; expand matched transfer items and refine skill signals; connect the storage adapter and component to the actual Logifera app.
