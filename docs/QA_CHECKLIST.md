# QA Checklist Before Release

## Navigation (Top Menu)
- Launch app and verify top comic menu is visible.
- Click each top button: `laboratory`, `barn`, `incubator`, `collection`, `arena`, `settings`.
- Verify `home` moves to previous scenario and `friends` to next scenario.
- Verify `achievements` toggles frame state (frame 1 / frame 2).

## Main Scenario Flow
- Solve one lab puzzle and confirm grains/xp update.
- Feed in barn and confirm egg progress updates and egg can spawn.
- In incubator: rub egg, start mini-game, complete success, check egg moves to collection.
- In collection: filter by rank and verify cards render.
- In arena: run local duel and verify rating/tickets change.
- In settings: update alarm/snooze values and confirm persisted state.

## Failure/Fallback Checks
- Open incubator with no eggs and verify CTA back to barn.
- Open collection with no awakened eggs and verify CTA to incubator.
- Disable backend temporarily and confirm PvP/cloud fallback messages are readable.

## PWA/Offline
- Install PWA and reload.
- Verify service worker serves menu/scenario art offline.
- Confirm manifest icons and splash assets are valid.

## Release Gate Commands
- `npm run verify`
- `npm run smoke`
- `npm run menu:validate`
- `npm run smoke:scenario`
- `npm run prod:check-env` (with production env loaded)

