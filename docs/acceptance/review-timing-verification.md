# Midnight Review Timing Verification, 2026-10-12

## Reproduced Baseline

The main task imported the committed `2894e04` progress module and the current module, running the same local-time sequence: independently answer apple at 23:58 on October 12, then again at 00:02 on October 13. The committed version records two success dates, step 2 and due October 15. The correction retains one success date, step 1 and due October 13; it does not present the item as ready at 00:02. Actual probe output is retained locally in `/private/tmp/ket-food-timing-baseline.log`.

## Implemented Boundaries

- Independently counted assessments of the same skill require a different local date, the scheduled due date, and at least four elapsed hours. Four hours is an adjustable anti-duplication teaching default, not a claimed scientific law or a recommendation for children to learn overnight.
- First assessments of reading and listening are separate; a first answer after an encounter is not blocked. Previously earned success dates survive mistakes and hints. Same-date corrections still do not restore independent mastery or change first-attempt scoring.
- `lastAssessedAt` is stored only for a counted independent success or an error/hint. Uncounted correct practice leaves that anchor unchanged, so repeatedly practising early cannot postpone the next eligible assessment.
- Old records retain their actual date evidence. An unknown previous-day timestamp is conservatively treated as no earlier than the end of that day; no fake exact historical timestamp is written. Legacy same-day overdue items retain their prior availability and do not advance on that date. Malformed timestamp fields are ignored without discarding the word history.
- A backwards device-clock change cannot make a future timestamp immediately eligible. A purely local browser cannot certify a deliberately changed forward clock or reconstruct old deleted history; neither capability is claimed.

## Daily Plan and Resume

- Due items still waiting for elapsed time are recorded as `deferredReviews`. Once eligible, they can enter the same saved day's plan without replacing its new-word or reading tasks.
- New reviews append as new groups. `reviewBatchEnds` preserves existing group boundaries, member order, question options, activity ID, and saved practice fingerprint, including an already-started short final batch.
- At most ten items per batch, thirty items per day and three batches per day remain enforced. If all three groups already exist, remaining items stay due for a later day rather than changing a partly answered batch.
- Items independently answered elsewhere are removed from the deferred queue. A legacy frozen batch with an early timestamp waits intact; it is not silently reordered or recreated.
- Child-facing copy says to continue today's listening/reading while waiting, without encouraging an overnight session. An in-progress correction in an answered batch can still be resumed.

## Actual Verification

- Sixteen new unit cases cover both skills, the exact four-hour boundary, errors/hints, repeated practice, old/malformed/future timestamps, month/year changes, empty-plan admission, preservation of a five-item partial batch, three-batch caps, and removal after another lesson's success.
- Focused logic/content suite: 49 / 49. Whole data and logic suite: 129 / 129 across twelve files.
- Desktop/mobile midnight flow and five-item-batch continuation were exercised. The first continuation test used the nonexistent `.practice-top` selector; the page was already correctly showing the second batch. The selector was corrected to the existing `.practice-header`, retaining the original resume, scoring and group assertions; both repeat cases passed.
- Final actual regression: lint/build passed, 129 / 129 data/logic tests, 116 / 116 root-path browser tests and 116 / 116 GitHub Pages production-path browser tests. The main task viewed both desktop/mobile waiting and ready screenshots. Final log: `/private/tmp/ket-food-timing-final-acceptance.log`.
- Overall acceptance still exits 1 at the full-bank image gate: 115 / 1687 reviewed photos, 1572 pending. Real children, acoustic pronunciation, and full-bank photo semantics are not inferred from these tests; remaining audit findings are not closed by this timing repair.
