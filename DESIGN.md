---
name: "Langgan"
description: "Kelola semua langgananmu — pantau pengeluaran bulanan, dapatkan pengingat jatuh tempo, dan kendalikan keuangan digitalmu dengan mudah."
colors:
  midnight-bg: "#0a0b10"
  midnight-surface: "#12131a"
  midnight-elevated: "#181a24"
  ink: "#e8eaf0"
  ink-muted: "#9a9eb5"
  cobalt: "#4a6de5"
  cobalt-muted: "#7b93f0"
  cobalt-glow: "#4a6de580"
  sunset: "#e8a23a"
  sunset-muted: "#f0c06a"
  error: "#e05a47"
  success: "#3db87a"
  warning: "#e8a23a"
typography:
  display:
    fontFamily: '"Geist", system-ui, sans-serif'
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: '"Geist", system-ui, sans-serif'
    fontSize: "clamp(1.5rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: '"Geist", system-ui, sans-serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: '"Geist", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: '"Geist", system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: '"Geist Mono", "SF Mono", monospace'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "18px"
  2xl: "22px"
  3xl: "28px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-muted}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-outline-hover:
    backgroundColor: "{colors.midnight-elevated}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.midnight-elevated}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.midnight-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
---

# Design System: Langgan

## 1. Overview

**Creative North Star: "The Warm Accountant's Desk"**

Langgan is a personal subscription tracker built for Indonesian consumers. The visual system embodies the feeling of sitting across from a friend who happens to be great with spreadsheets: warm, trustworthy, and never cold or corporate. The default dark mode evokes a late-night check-in — calm, focused, and free of the anxiety that dense banking dashboards provoke.

The system rejects the generic SaaS template, the cartoonish fintech mascot, and the overly serious navy-and-gold trading aesthetic. Instead, it finds its identity in warm minimalism: clean layouts with generous breathing room, rounded corners that soften the financial context, and a restrained color strategy where cobalt blue carries trust and a warm amber accent signals action and attention.

**Key Characteristics:**
- Dark mode by default (near-black `midnight-bg`), light mode available
- Semantic OKLCH tokens throughout — no hard-coded colors in components
- Mobile-first touch targets (minimum 44×44dp)
- Serif italic accents on display headings for editorial warmth (Georgia on accent phrases)
- WCAG 2.1 AA contrast compliance on all text
- `prefers-reduced-motion` respected: animations become instant transitions

## 2. Colors

The palette is built on a **Restrained** color strategy: tinted neutrals carry 80%+ of the surface, a single primary (cobalt) handles action and trust, and a warm accent (sunset amber) is used sparingly for highlights and warnings.

### Primary
- **Midnight Blue** (`oklch(0.52 0.14 240)` / `#4a6de5`): The dominant action color. Used for primary buttons, active navigation states, links, focus rings, and the logo mark. Its role is trust and clarity: this is the color that says "it's safe to click here."
- **Midnight Blue Muted** (`oklch(0.65 0.12 240)` / `#7b93f0`): Hover and secondary emphasis. Applied to primary button hovers, selected states, and subtle highlights.
- **Cobalt Glow** (`oklch(0.52 0.14 240 / 50%)` / `#4a6de580`): Focus rings and ambient glow effects. Semi-transparent to avoid harsh borders.

### Accent
- **Sunset Gold** (`oklch(0.72 0.14 75)` / `#e8a23a`): The sparing accent. Used for warning badges, overdue subscription indicators, and the occasional warm highlight. Its rarity is the point: when it appears, it carries urgency.
- **Sunset Gold Muted** (`oklch(0.80 0.10 75)` / `#f0c06a`): Secondary warm tones for subtle amber backgrounds.

### Neutral
- **Midnight Background** (`oklch(0.08 0.012 240)` / `#0a0b10`): The default dark mode surface. Almost black with a hint of blue — never pure `#000000`.
- **Midnight Surface** (`oklch(0.13 0.015 240)` / `#12131a`): Card and container backgrounds. One step lighter than the page bg for tonal layering.
- **Midnight Elevated** (`oklch(0.17 0.018 240)` / `#181a24`): Popovers, dropdowns, input backgrounds, and hover states on secondary surfaces.
- **Ink** (`oklch(0.94 0.008 240)` / `#e8eaf0`): Primary text color. Off-white with a cool blue tint for comfortable dark-mode reading.
- **Ink Muted** (`oklch(0.65 0.010 240)` / `#9a9eb5`): Secondary text, descriptions, placeholders. Still readable at 4.5:1 contrast.
- **Border** (`oklch(0.94 0.008 240 / 10%)` / `#e8eaf019`): Subtle dividers, card outlines, input strokes. Almost invisible until you look for them.

### Functional
- **Error / Destructive** (`oklch(0.55 0.18 25)` / `#e05a47`): Delete actions, validation errors, critical warnings.
- **Success** (`oklch(0.65 0.14 145)` / `#3db87a`): Confirmation states, paid subscriptions, positive feedback.
- **Warning** (`oklch(0.72 0.14 80)` / `#e8a23a`): Overdue items, pending actions. Same hue family as the sunset accent.

### Named Rules
**The One Voice Rule.** The primary cobalt accent is used on ≤10% of any given screen. Its rarity is the point — when it appears, it signals action. The sunset gold is rarer still: ≤5% of screen real estate.

**The Warmth-by-Accent Rule.** Body backgrounds are never cream, sand, or beige. Warmth is carried entirely by the sunset accent color, the rounded corners, and the serif italic display accents — never by tinting the neutral bg toward warmth.

## 3. Typography

**Display Font:** Geist (with system-ui fallback)  
**Body Font:** Geist (with system-ui fallback)  
**Label/Mono Font:** Geist Mono (with SF Mono fallback)  
**Serif Accent:** Georgia, "Times New Roman", serif (for italic display accents only)

**Character:** A single geometric sans-serif family (Geist) carries the entire UI with clean precision and modern warmth. The pairing is not a pair: Geist alone handles all roles. The only departure is a serif italic accent on hero display headings, where the phrase "Tagihan Langganan" renders in Georgia italic to add editorial personality without disrupting the systematic feel.

### Hierarchy
- **Display** (700 weight, `clamp(2rem, 5vw, 4.5rem)`, line-height 1.1, letter-spacing -0.02em): Hero headlines on the landing page. Maximum one per page. Uses `text-wrap: balance` for even line lengths.
- **Headline** (600 weight, `clamp(1.5rem, 3vw, 2.5rem)`, line-height 1.2): Section titles, dialog headers, dashboard page titles.
- **Title** (600 weight, 1.25rem, line-height 1.3): Card titles, form section labels, list item headings. Uses `font-heading` token.
- **Body** (400 weight, 1rem / 16px, line-height 1.6): Descriptions, form help text, dashboard summaries. Maximum line length 65ch.
- **Label** (500 weight, 0.875rem / 14px, line-height 1.4, letter-spacing 0.02em): Button text, badge labels, input placeholders, nav links. Uppercase used only for very short labels (≤4 words).
- **Mono** (400 weight, 0.875rem, line-height 1.5): Currency amounts in IDR, date stamps, technical metadata. Uses `tabular-nums` for alignment.

### Named Rules
**The Single Family Rule.** Geist carries the entire UI. The serif italic accent is the only exception, and it is applied selectively (one phrase per hero, never in body copy). Adding a second sans-serif would fracture the system.

**The 16px Floor Rule.** Body text is never smaller than 1rem (16px). Labels can be 0.875rem (14px) only when they are true labels, not reading text.

## 4. Elevation

Depth is conveyed through a hybrid of **tonal layering** and **soft ambient shadows**. The baseline is flat: cards, inputs, and buttons sit at rest with no shadow. When a surface elevates — hover on a card, a dropdown opening, a modal appearing — a soft, diffuse shadow appears to signal the state change without heavy drop-shadow drama.

### Shadow Vocabulary
- **Ambient Low** (`0 4px 24px rgba(0, 0, 0, 0.12)`): Card hover states, dropdown menus. Diffuse and subtle.
- **Ambient Medium** (`0 8px 32px rgba(0, 0, 0, 0.16)`): Dialog overlays, modal popups. Slightly more presence but still soft.
- **Ambient Glow** (`0 0 40px var(--primary) / 15%`): Hero ambient glow, focus ring halos. Colored glow for warmth.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus). No permanent card shadows — that is the SaaS template tell.

## 5. Components

### Buttons
- **Shape:** Rounded corners (10px / `rounded-md`). Generous padding (10px 20px on default, larger on `size="lg"`).
- **Primary:** Midnight blue background (`cobalt`), ink text. Hover: muted blue (`cobalt-muted`) with `translateY(-1px)` lift and scale `[1.02]`.
- **Outline:** Transparent background, border at `border` token opacity. Hover: midnight-elevated background fill.
- **Ghost:** No background, ink-muted text. Hover: midnight-elevated background, ink text.
- **Destructive:** Error color at 10% opacity background, error text. Hover: error at 20% opacity.
- **Link:** Primary color text with underline on hover. No background.
- **Focus:** Ring-3 at `ring` token (`cobalt` at 50% opacity). Visible focus states on all variants.
- **Disabled:** Opacity 50%, pointer-events none.

### Badges
- **Shape:** Fully rounded (`rounded-4xl` / pill shape). Compact: h-5, px-2.
- **Default:** Midnight blue background, ink text.
- **Secondary:** Midnight-elevated background, ink text.
- **Destructive:** Error at 10% opacity background, error text.
- **Outline:** Transparent, border at `border` token.
- **Ghost:** No background, hover tint.

### Cards
- **Corner Style:** Generous rounding (14px / `rounded-xl`).
- **Background:** Midnight surface (`midnight-surface`).
- **Border:** Ring-1 at `foreground/10` — a barely-there outline that separates cards from the page bg.
- **Shadow Strategy:** Flat at rest. On hover: ambient-low shadow appears.
- **Internal Padding:** 16px (`--card-spacing: --spacing(4)`), 12px on `size="sm"`.
- **Structure:** Header (title + optional action), content, footer (border-t, muted/50 bg).

### Inputs / Fields
- **Style:** Transparent background, border at `input` token (`ink/15%`). Rounded-lg (10px).
- **Focus:** Border shifts to `ring` token (`cobalt/50%`), ring-3 glow.
- **Error:** Border and ring turn destructive. Dark mode: border at 50% opacity.
- **Disabled:** Input bg at 50% opacity, cursor not-allowed.
- **Placeholder:** Ink-muted text.
- **File upload:** Inline flex, transparent bg, medium weight label.

### Dialogs / Modals
- **Overlay:** Black at 10% opacity with `backdrop-blur-xs`. Fade in/out animation.
- **Content:** Midnight-elevated background (`popover`), rounded-xl (14px), ring-1 border.
- **Animation:** Fade + zoom (scale 0.95 → 1.0) on open. Reverse on close.
- **Close button:** Ghost button, icon-sm, top-right corner.
- **Footer:** Muted/50 background, border-t, rounded-b-xl. Flex row on desktop, stacked reverse on mobile.

### Navigation
- **Desktop:** Horizontal bar, fixed top, z-40. Backdrop-blur-md at `background/80`.
- **Items:** Rounded-lg (10px) pills. Active: midnight-elevated bg + ink text. Inactive: ink-muted text, hover to ink + midnight-elevated/50 bg.
- **Mobile:** Hamburger opens a left drawer (w-72, z-50, backdrop at `black/50`). Focus trap + Escape close + body scroll lock.
- **Avatar:** 36px circle, primary bg, ink text fallback.
- **Z-index scale:** Nav 40, Drawer 50. No arbitrary values.

### Subscription Cards (Signature Component)
- **Layout:** Horizontal card with icon left, name + category center, amount + date right.
- **Overdue State:** Sunset gold warning badge + amber text. Not destructive — financial anxiety is the enemy.
- **Delete:** Destructive button with confirmation dialog. Error handling with retry.

## 6. Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg-card`, `text-primary`, `border-border`) — never hard-code colors.
- **Do** keep body text at 1rem (16px) minimum. Labels can be 0.875rem.
- **Do** round all corners at the `rounded-md` (10px) or `rounded-lg` (14px) scale. Sharp corners are the exception, not the rule.
- **Do** use `text-balance` on h1–h3 and `text-pretty` on long prose.
- **Do** provide 44×44dp minimum touch targets on all interactive elements.
- **Do** use `focus-visible:ring-2` + `ring-offset-2` on all focusable elements. No invisible focus states.
- **Do** respect `prefers-reduced-motion`: disable fade-in-up animations, keep opacity at 1.
- **Do** write all copy in Indonesian. "Mulai Gratis" not "Get Started." IDR formatting: `Rp 150.000`, not `Rp150000`.
- **Do** make error states informative with retry actions. Never leave the user stuck.

### Don't:
- **Don't** use cream, sand, beige, or parchment body backgrounds. Warmth is carried by accent + typography, not by tinted neutrals. (From PRODUCT.md: "The cream / sand / beige body bg is the saturated AI default.")
- **Don't** use gradient text (`background-clip: text`). Decorative, never meaningful. Use a single solid color.
- **Don't** use side-stripe borders (`border-left` > 1px as colored accent). Rewrite with full borders, background tints, or nothing.
- **Don't** use the hero-metric template (big number + small label + gradient). SaaS cliché.
- **Don't** use identical card grids with icon + heading + text repeated endlessly. Break symmetry with bento layouts.
- **Don't** use tiny uppercase tracked eyebrows above every section. One named kicker is voice; an eyebrow on every section is AI grammar.
- **Don't** use cartoonish or childish aesthetics (Duolingo-level playfulness, bubbly shapes). Friendly is fine; juvenile is not. (From PRODUCT.md)
- **Don't** build dense banking dashboards (dark-gray data grids, tiny numbers, overwhelming tables). This is personal finance, not trading. (From PRODUCT.md)
- **Don't** use generic SaaS template copy ("streamline / empower / supercharge / unleash / transform"). Pick a specific noun and verb. (From PRODUCT.md)
- **Don't** use overly serious fintech palettes (navy + gold, all-caps labels, rigid hierarchy). The user is managing Spotify, not a stock portfolio. (From PRODUCT.md)
- **Don't** use glassmorphism as default. Blurs and glass cards used decoratively are a tell. Rare and purposeful, or nothing.
- **Don't** disable browser zoom (`user-scalable=no`). Fix the layout if it breaks at 200% zoom.
- **Don't** use `px` for font sizes. Use `rem` to respect user browser settings.
- **Don't** use all-caps for body copy. Reserve uppercase for short labels (≤4 words) and badges.
