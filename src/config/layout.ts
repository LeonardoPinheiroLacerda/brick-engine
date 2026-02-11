/**
 * Grid, display, and canvas layout configurations.
 *
 * Defines the logical dimensions of the game area, font ratios,
 * and responsive canvas scaling factors.
 */
export const LAYOUT = {
    /** Main game grid dimensions. */
    GRID: {
        X: 11,
        Y: 18,
    },

    /** Head-Up Display (HUD) grid dimensions. */
    HUD_GRID: {
        X: 4,
        Y: 4,
    },

    /** Logical display settings within the container. */
    DISPLAY: {
        WIDTH: 0.65,
        MARGIN: 0.025,
    },

    /** Aspect ratio multiplier for the device body height relative to width. */
    BODY_HEIGHT_WIDTH_MULTIPLIER: 1.9,

    /** Predefined font scale factors relative to container size. */
    FONT_SIZE: {
        EXTRA_SMALL: 0.05,
        SMALL: 0.065,
        MEDIUM: 0.1,
        LARGE: 0.125,
        EXTRA_LARGE: 0.15,
    },

    /** Sizing and spacing for individual grid cells. */
    CELL: {
        OUTER_MARGIN: 0.1,
        INNER_MARGIN: 0.3,
        STROKE_WEIGHT: 0.075,
    },

    /** Responsive canvas scaling and aspect ratio settings. */
    CANVAS: {
        WIDTH_RATIO: 0.7,
        ASPECT_RATIO: 1.114, // Height relative to width
    },

    /** Standard shadow dispersion size for UI depth. */
    SHADOW_DISPERSION: '3px',
} as const;
