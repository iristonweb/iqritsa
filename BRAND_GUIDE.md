# IQritsa Brand Guide

## Core Character
- Main mascot: white chicken with visible pink brain, expressive eyes, bright beak.
- Personality: curious, clever, playful, progressively more "genius" through the game.
- Use the same silhouette and proportions in all channels to keep recognition high.

## Color Palette
- Background dark: `#050510`
- Cyan accent: `#00f2ff`
- Brain pink range: `#ffc6d3` -> `#e98698`
- Beak gold range: `#ffc84f` -> `#ef9700`
- Neutral feather white: `#fbf8ee`

## Logo Assets
- Web logo: `client/public/brand/iqritsa-logo.png` (editable source: `.svg`)
- OG preview: `client/public/brand/og-chicken-brand.png` (editable source: `.svg`)
- Favicon: `client/public/favicon.png`
- PWA icons: `client/public/icons/icon-192.png`, `client/public/icons/icon-512.png`

## Mobile Brand Sources
- Store-ready PNG files:
  - `mobile/assets/icon-1024.png`
  - `mobile/assets/adaptive-icon.png`
  - `mobile/assets/splash.png`
- Editable source vectors: `mobile/assets/icon-source.svg`, `mobile/assets/adaptive-icon-source.svg`, `mobile/assets/splash-source.svg`

## Style Variants
- Available presets:
  - `classic_dark`
  - `neon_glow`
  - `warm_gold`
- Variant outputs:
  - `mobile/assets/variants/<preset>/...`
  - `client/public/icons/variants/<preset>/...`
  - `client/public/brand/variants/<preset>/...`
- Active preset right now: `neon_glow`.
- Regenerate and set active preset:
  - `npm run brand:generate`
- Switch active preset only:
  - `npm run brand:activate:classic`
  - `npm run brand:activate:neon`
  - `npm run brand:activate:warm`
- Validate full asset pack:
  - `npm run brand:validate`
  - `npm run brand:premium` (generate + validate)

## Skin Evolution System
- Skin definitions live in `client/src/lib/chickenSkins.ts`.
- Combined progress formula:
  - stage contribution + player level contribution + XP contribution.
- 8 skin tiers unlock progressively:
  - `base-hen` -> `spark-hen` -> `logic-hen` -> `lab-hen` -> `prof-hen` -> `quantum-hen` -> `cosmo-hen` -> `omega-hen`.

## Usage Rules
- Keep enough contrast for small icon sizes.
- Do not crop out the brain element from hero visuals.
- For dark surfaces prefer cyan highlights; for light surfaces use dark outlines.

## Premium Release Checklist
- Run `npm run brand:premium` and ensure no validation errors.
- Run `npm run build` and confirm production build succeeds.
- Verify `client/index.html` references PNG assets for favicon and OG image.
- Verify `client/public/manifest.webmanifest` points to PNG icons.
- Verify `mobile/app.json` points to `icon-1024.png`, `adaptive-icon.png`, `splash.png`.
