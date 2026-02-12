export default {
    /** Colors used for styling the game interface. */
    colors: {
        /** Primary background color for the game screen. */
        background: 'rgb(172, 189, 173)',
        /** Active Font/Cell color. */
        active: 'rgb(19, 26, 18)',
        /** Inactive Font/Cell color. */
        inactive: 'rgba(161, 178, 160, 1)',

        /** Main theme color for the game device body. */
        bodyMain: 'rgb(0, 68, 187)',
        /** Secondary theme color for the buttons on the device body. */
        bodyButton: 'rgb(247, 222, 57)',
    },
    /** Screen layout configurations. */
    screenLayout: {
        /** Main game grid dimensions. */
        grid: {
            x: 11,
            y: 18,
        },

        /** Head-Up Display (HUD) grid dimensions. */
        hudGrid: {
            x: 4,
            y: 4,
        },

        /** Logical display settings within the container. */
        display: {
            width: 0.65,
            height: 0.954,
            margin: 0.022,
            borderWeight: 0.0075,
        },

        /** Predefined font scale factors relative to container size. */
        fontSize: {
            extraSmall: 0.05,
            small: 0.065,
            medium: 0.1,
            large: 0.125,
            extraLarge: 0.15,
        },

        /** Sizing and spacing for individual grid cells. */
        cell: {
            margin: 0.1,
            padding: 0.3,
            strokeWeight: 0.075,
        },
    },
    /** View layout configurations. */
    viewLayout: {
        /** Aspect ratio multiplier for the device body height relative to width. */
        bodyHeightWidthMultiplier: 1.9,

        /** Screen width threshold for switching to mobile layout (in pixels). */
        mobileBreakpoint: 600,

        /** Responsive canvas scaling and aspect ratio settings. */
        canvas: {
            widthRatio: 0.7,
            aspectRatio: 1.114, // Height relative to width
        },

        /** Delay before hiding the splash screen after initialization (in milliseconds). */
        splashHideDelayMs: 250,

        /** Dimensions and ratios for the game interface. */
        dimensions: {
            /** Border radius as a ratio of container width. */
            borderRadiusRatio: 0.05,
            /** Border width as a ratio of container width. */
            borderWidthRatio: 0.006,

            /** Button-specific scaling factors. */
            button: {
                /** Small button size ratio. */
                smSizeRatio: 0.08,
                /** Medium/Standard button size ratio. */
                mdSizeRatio: 0.18,
                /** Large action button size ratio. */
                lgSizeRatio: 0.25,

                /** Scaling factors specifically for mobile viewports. */
                mobile: {
                    /** Mobile small button size ratio. */
                    smSizeRatio: 0.13,
                    /** Mobile medium/standard button size ratio. */
                    mdSizeRatio: 0.26,
                    /** Mobile large action button size ratio. */
                    lgSizeRatio: 0.35,
                    /** Standard font ratio for mobile buttons. */
                    fontRatio: 0.05,
                    /** Small font ratio for mobile buttons. */
                    smFontRatio: 0.04,
                    /** Large font ratio for mobile buttons. */
                    lgFontRatio: 0.055,
                    /** Spacing ratio between mobile buttons. */
                    spacingRatio: 0.018,
                },
                /** Button border width as a ratio of container width. */
                borderRatio: 0.0045,
                /** Duration for button press animations. */
                animationDuration: '0.15s',
            },
        },

        /** Standard shadow dispersion size for UI depth. */
        shadowDispersion: '3px',
    },
    /** Input query parameters. */
    inputQueryParams: {
        /** Key for customizing the device body main color. */
        mainColor: 'body-color',
        /** Key for customizing the device body button color. */
        buttonColor: 'button-color',
        /** Key for detecting if the game is running on a mobile app wrapper. */
        runningOnApp: 'mobile',
    },
    /** Selectors for DOM elements. */
    selectors: {
        /** Root container where the P5 instance is attached. */
        parent: '#brick-game',

        /** Splash screen shown during initial load. */
        splash: '#splash',

        /** Modal IDs used for session continuation. */
        modalIds: {
            /** Modal shown when continuing a previous session. */
            sessionModal: '#session-modal',
            /** Confirmation button in the session modal. */
            sessionContinueYes: '#session-modal-yes',
            /** Cancellation button in the session modal. */
            sessionContinueNo: '#session-modal-no',
        },

        /** Explicit IDs assigned to dynamically created DOM elements. */
        viewElementIds: {
            canvas: 'brick-game-canvas',
            container: 'container',
            frame: 'frame',
            buttonContainer: 'button-container',
            smallButtonContainer: 'small-button-container',
            innerButtonContainer: 'inner-button-container',
            mediumButtonContainer: 'medium-button-container',
            directionVerticalContainer: 'direction-vertical-container',
            directionHorizontalContainer: 'direction-horizontal-container',
            largeButtonContainer: 'large-button-container',
        },
    },
    /** Storage keys for persisting data in LocalStorage. */
    storageKeys: {
        /** Key for audio muting preference. */
        muted: 'MUTED',
        /** Key for color mode preference. */
        colorEnabled: 'COLOR_ENABLED',

        /** Key for the current game grid state. */
        grid: 'GRID',
        /** Key for the current HUD grid state. */
        hudGrid: 'HUD_GRID',
        /** Key for the game speed/tick interval. */
        tickInterval: 'TICK_INTERVAL',
        /** Key for the user's high score. */
        score: 'SCORE',
    },
    /** Button hold settings. */
    buttonHold: {
        /** Initial delay before a held button starts repeating (in milliseconds). */
        holdDelayMs: 250,
        /** Interval between repeated actions while a button is held (in milliseconds). */
        holdIntervalMs: 50,
    },
} as const;
