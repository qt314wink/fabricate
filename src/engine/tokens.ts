/**
 * Canonical motion tokens.
 * Spec values kept; units made explicit so 30fps and 60fps match.
 */
export const motionMs = {
  instant: 50,
  fast: 150,
  medium: 300,
  slow: 600,
} as const;

export type MotionSpeed = keyof typeof motionMs;

/** Cubic-bezier strings for chrome (DOM/GSAP/Framer) only. */
export const easing = {
  standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0.0, 1, 1)",
  elastic: "cubic-bezier(0.2, 1.2, 0.2, 1)",
} as const;

/**
 * Spec spring { tension: 170, friction: 26, mass: 1 }.
 * Interpreted as a damped harmonic oscillator:
 *   acc = (tension * (target - x) - friction * v) / mass
 */
export const spring = {
  standard: { tension: 170, friction: 26, mass: 1 },
  snap: { tension: 170, friction: 20, mass: 1 },
} as const;

/**
 * Spec inertia: velocity *= 0.92 per frame at 60fps.
 * k = -60 * ln(0.92) ≈ 4.997 s^-1
 */
export const inertia = {
  dampingPerSecond: 4.997,
  dragGain: 0.005,
} as const;

/**
 * Spec morph/slider lerp 0.1 per frame at 60fps
 * => time constant τ ≈ 158ms.
 */
export const follow = {
  morphTau: 0.158,
  scaleTau: 0.102,
  fadeTau: 0.158,
  hoverTau: 0.04,
} as const;

export const budgets = {
  canvasFps: 60,
  overlayFps: 30,
  frameMs: 16.67,
  ackMs: 16,
  feedbackMs: 100,
  transitionMs: 300,
  landingMs: 500,
  hoverGpuMs: 16,
  morphMs: { min: 200, max: 400 },
} as const;

export const reducedMotion = {
  maxDurationMs: 80,
  disableInertia: true,
  disableElasticOvershoot: true,
  disableHoverLift: true,
} as const;
