/**
 * Visual component themes and responsive dimension ratios.
 *
 * Defines how elements like borders and buttons scale relative to the main container.
 */
export const THEME = {
    /** Scale ratios for the main game container. */
    DIMENSIONS: {
        /** Border radius as a ratio of container width. */
        BORDER_RADIUS_RATIO: 0.05,
        /** Border width as a ratio of container width. */
        BORDER_WIDTH_RATIO: 0.006,

        /** Button-specific scaling factors. */
        BUTTON: {
            /** Small button size ratio. */
            SM_SIZE_RATIO: 0.08,
            /** Medium/Standard button size ratio. */
            MD_SIZE_RATIO: 0.18,
            /** Large action button size ratio. */
            LG_SIZE_RATIO: 0.25,

            /** Scaling factors specifically for mobile viewports. */
            MOBILE: {
                /** Mobile small button size ratio. */
                SM_SIZE_RATIO: 0.13,
                /** Mobile medium/standard button size ratio. */
                MD_SIZE_RATIO: 0.26,
                /** Mobile large action button size ratio. */
                LG_SIZE_RATIO: 0.35,
                /** Standard font ratio for mobile buttons. */
                FONT_RATIO: 0.05,
                /** Small font ratio for mobile buttons. */
                SM_FONT_RATIO: 0.04,
                /** Large font ratio for mobile buttons. */
                LG_FONT_RATIO: 0.055,
                /** Spacing ratio between mobile buttons. */
                SPACING_RATIO: 0.018,
            },
            /** Button border width as a ratio of container width. */
            BORDER_RATIO: 0.0045,
            /** Duration for button press animations. */
            ANIMATION_DURATION: '0.15s',
        },
    },
} as const;
