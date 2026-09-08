/**
 * The engineering colour semantics, as literal values.
 *
 * The same four meanings are defined as CSS custom properties in `index.css`
 * and used by every Tailwind utility (`text-flow`, `bg-active`, …). This module
 * is their SVG counterpart, and it exists for a specific reason:
 *
 * A `fill` or `stroke` given as `var(--color-x)` **cannot be transitioned
 * reliably**. When the value changes, the browser resolves the custom property
 * a commit later than it interpolates the transition, so an animated element
 * renders the previous state's colour — a highlight that is always one step
 * behind the thing it is meant to highlight.
 *
 * So: CSS variables for HTML, these literals for anything in SVG that
 * transitions. Keep the two in step.
 */
export const C = {
  /** Nominal signal, information flow. */
  flow: '#45b394',
  /** Selected, active, correct, present. */
  active: '#e8c77a',
  /** Failure, mismatch, fault. */
  fault: '#e2603f',
  /** Inactive architecture. */
  idle: '#46566d',

  muted: '#a7b3c8',
  faint: '#737f96',
  parchment: '#f3e6cc',
  void: '#04060d',
} as const

export type Tone = keyof typeof C
