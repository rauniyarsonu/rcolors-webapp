/**
 * Hover shadow that fades in via opacity on an ::after layer, so only opacity animates
 * (box-shadow transitions repaint every frame). The host needs `relative` and `rounded-lg`.
 */
export const hoverShadow =
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100";
