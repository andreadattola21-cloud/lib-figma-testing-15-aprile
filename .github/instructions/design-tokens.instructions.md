---
description: "Use when implementing or reviewing design token usage. Covers token categories, valid prefixes, and the token sync pipeline."
applyTo: ["packages/tokens/**", "packages/components/src/**/*.css"]
---
# Design Token Rules

## Token Categories & CSS Prefixes

| Figma variable category | CSS custom property prefix | Example |
|------------------------|---------------------------|---------|
| Color (primitives)     | `--ds-gray-*`, `--ds-blue-*`, `--ds-red-*`, etc. | `--ds-gray-800` |
| Color (semantic)       | `--ds-background-*`, `--ds-text-*`, `--ds-border-*`, `--ds-icon-*` | `--ds-text-default-default` |
| Spacing                | `--ds-space-*`            | `--ds-space-400` = 16px |
| Border radius          | `--ds-radius-*`           | `--ds-radius-200` = 8px |
| Typography size        | `--ds-scale-*`            | `--ds-scale-03` = 16px |
| Font family            | `--ds-family-*`           | `--ds-family-sans` |
| Font weight            | `--ds-weight-*`           | `--ds-weight-bold` |
| Stroke                 | `--ds-stroke-*`           | `--ds-stroke-border` = 1px |
| Shadow / depth         | `--ds-depth-*`            | `--ds-depth-200` = 8px |
| Padding (legacy)       | `--ds-padding-*`          | prefer `--ds-space-*` |

## Spacing Scale
| Token | Value |
|-------|-------|
| `--ds-space-0` | 0px |
| `--ds-space-050` | 2px |
| `--ds-space-100` | 4px |
| `--ds-space-200` | 8px |
| `--ds-space-300` | 12px |
| `--ds-space-400` | 16px |
| `--ds-space-600` | 24px |
| `--ds-space-800` | 32px |
| `--ds-space-1200` | 48px |
| `--ds-space-1600` | 64px |
| `--ds-space-2400` | 96px |
| `--ds-space-4000` | 160px |

## Rules
- NEVER hardcode hex colors, px spacing, px radii, or font sizes
- Always use `var(--ds-*)` — run `get_variable_defs` if unsure which token to use
- Prefer primitive color tokens (`--ds-gray-*`) over semantic tokens when semantic tokens have `#NaN` values (known sync issue)
- Components must not import from `@ds/tokens` directly — the CSS custom properties are loaded globally
