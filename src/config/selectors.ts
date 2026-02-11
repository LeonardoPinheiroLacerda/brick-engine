/**
 * DOM Selectors and Element IDs used for identifying and manipulating game elements.
 */
export const SELECTORS = {
    /** Root container where the P5 instance is attached. */
    PARENT: '#brick-game',

    /** Splash screen shown during initial load. */
    SPLASH: '#splash',

    /** Modal IDs used for session continuation. */
    MODAL_IDS: {
        /** Modal shown when continuing a previous session. */
        SESSION_MODAL: '#session-modal',
        /** Confirmation button in the session modal. */
        SESSION_CONTINUE_YES: '#session-modal-yes',
        /** Cancellation button in the session modal. */
        SESSION_CONTINUE_NO: '#session-modal-no',
    },

    /** Explicit IDs assigned to dynamically created DOM elements. */
    VIEW_ELEMENT_IDS: {
        CANVAS: 'brick-game-canvas',
        CONTAINER: 'container',
        FRAME: 'frame',
        BUTTON_CONTAINER: 'button-container',
        SMALL_BUTTON_CONTAINER: 'small-button-container',
        INNER_BUTTON_CONTAINER: 'inner-button-container',
        MEDIUM_BUTTON_CONTAINER: 'medium-button-container',
        DIRECTION_VERTICAL_CONTAINER: 'direction-vertical-container',
        DIRECTION_HORIZONTAL_CONTAINER: 'direction-horizontal-container',
        LARGE_BUTTON_CONTAINER: 'large-button-container',
    },
} as const;
