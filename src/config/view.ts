/**
 * View-layer interaction and behavioral settings.
 *
 * Includes timing constants for button holds and responsive breakpoints.
 */
export const VIEW = {
    /** Screen width threshold for switching to mobile layout (in pixels). */
    MOBILE_BREAKPOINT: 600,

    /** Initial delay before a held button starts repeating (in milliseconds). */
    HOLD_DELAY_MS: 250,
    /** Interval between repeated actions while a button is held (in milliseconds). */
    HOLD_INTERVAL_MS: 50,
    /** Delay before hiding the splash screen after initialization (in milliseconds). */
    SPLASH_HIDE_DELAY_MS: 250,
} as const;
