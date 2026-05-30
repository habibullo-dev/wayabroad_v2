# WayAbroad Design System

Single source of truth for the UI. Derived from the `ui-ux-pro-max` engine and adapted with
`frontend-design` judgment for a trust-critical, form-heavy product. The raw engine output is
kept in `design-system/wayabroad/MASTER.md`; **this file is what we actually build to.**

## Direction — "editorial academic"

Trustworthy, modern, optimistic, globally-minded — not childish, not heavy glassmorphism.
Clean white cards on a warm-paper background, soft elevation, a confident indigo brand with a
warm persimmon accent, and a characterful serif for display headings.

## Color (semantic tokens → `app/globals.css`)

All color flows through shadcn CSS variables. **Never hardcode hex in components.**

| Token | Light | Role |
|---|---|---|
| `--primary` | indigo `244 55% 44%` | brand, primary CTAs, links, focus ring |
| `--brand-accent` | persimmon `13 85% 60%` | signature accent (logo dot, highlights) — used sparingly |
| `--background` | warm paper `40 33% 98%` | page |
| `--card` | white | surfaces |
| `--foreground` | ink `240 24% 12%` | text |
| `--success` | emerald `158 64% 36%` | **high match / positive** |
| `--warning` | amber `36 92% 45%` | **medium match / "verify" notes** |
| `--destructive` | rose `350 70% 50%` | errors / low / destructive |

Full light **and** dark sets are defined; design both together. Functional colors (match,
verify) are kept separate from brand color and always pair with an icon or text — never
color-only meaning.

## Typography

- **Display / headings:** Fraunces (serif) via `--font-display` / Tailwind `font-display`.
  Auto-applied to `h1/h2/h3`. Use for page titles and hero.
- **Body / UI:** Hanken Grotesk (sans) via `--font-sans` (the default). Deliberately not Inter.
- **Data (costs, GPA, scores):** add `tabular-nums` so figures don't shift.

## Spacing, radius, elevation

- 4 / 8px rhythm. Page container `max-w-6xl px-4 sm:px-6`.
- Radius: `--radius: 0.625rem` (`rounded-lg`); cards `rounded-xl`.
- Elevation: `shadow-sm` on cards; subtle glass (`bg-background/80 backdrop-blur-md`) only on
  the sticky nav and modal/sheet overlays.

## Components (`components/`)

- `ui/` — shadcn primitives: `button`, `card`, `input`, `label`, `badge` (+ `success`/`warning`/
  `accent`/`muted` variants for match & sample-data chips).
- `brand/logo.tsx` — indigo "W" tile + persimmon destination dot.
- `layout/site-header.tsx` (sticky glass nav, mobile menu) and `layout/site-footer.tsx`.

## Mandated product patterns

- **Sample-data badge:** wherever synthetic `admission_records` drive a number, show a
  `Badge variant="muted"` / `warning` "Sample data" chip.
- **Cost notes:** every tuition/dorm/visa/living figure carries a small "estimate — verify
  with the university" note.
- **Probability:** always with a confidence band + drivers; color via `success`/`warning`/
  `destructive` (high/medium/low) — never a bare %.

## Accessibility / states (non-negotiable)

- Visible focus rings (`focus-visible:ring-2 ring-ring ring-offset-2`) on every interactive
  element. Touch targets: primary & mobile controls ≥ 44px (`size="lg"` buttons, `h-11`
  inputs, `min-h-11` menu rows); dense desktop controls ≥ 40px (WCAG 2.2 min is 24px).
- Every input has a real `<Label>`; errors render below the field with `aria-invalid` +
  `role="alert"`; loading buttons disable + show a spinner.
- Contrast ≥ 4.5:1; respect `prefers-reduced-motion`; transitions 150–300ms.
- Verify at 375 / 768 / 1024 / 1440px and in dark mode.
