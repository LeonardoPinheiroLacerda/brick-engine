/**
 * Color and style tokens for the game UI and components.
 *
 * Includes primary background colors, font colors, and body theme colors.
 */
export const COLORS = {
    /** Primary background color for the game screen. */
    BACKGROUND: 'rgb(172, 189, 173)',
    /** Standard font color for active text. */
    FONT: 'rgb(19, 26, 18)',
    /** Font color for inactive/turned-off elements. */
    FONT_TURNED_OFF: 'rgb(161, 178, 160)',

    /** Main theme color for the game device body. */
    BODY_MAIN: 'rgb(0, 68, 187)',
    /** Secondary theme color for the buttons on the device body. */
    BODY_BUTTON: 'rgb(247, 222, 57)',
} as const;
