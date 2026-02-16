/**
 * Enumerates all available cell's colors
 *
 * @enum
 */
export enum Color {
    DEFAULT = 'rgb(19, 26, 18)',
    BLUE = 'rgb(0, 0, 128)',
    CYAN = 'rgb(0, 128, 128)',
    GRAY = 'rgb(128, 128, 128)',
    GREEN = 'rgb(0, 128, 0)',
    PURPLE = 'rgb(128, 0, 128)',
    RED = 'rgb(128, 0, 0)',
    YELLOW = 'rgb(128, 128, 0)',
    INACTIVE = 'rgb(166, 183, 165)',
}

/**
 * Enumerates all available font aligns when using the game utilities for writing text on screen
 *
 * @enum
 */
export enum FontAlign {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
}

/**
 * Enumerates all available font sizes when using the game utilities for writing text on screen
 *
 * @enum
 */
export enum FontSize {
    EXTRA_SMALL = 0,
    SMALL = 1,
    MEDIUM = 2,
    LARGE = 3,
    EXTRA_LARGE = 4,
}

/**
 *
 * Enum for vertical alignment of text.
 *
 * @enum
 */
export enum FontVerticalAlign {
    CENTER = 'center',
    TOP = 'top',
    BOTTOM = 'bottom',
}

/**
 * Enumerates all available sound effects
 *
 * @enum
 */
export enum Sound {
    SPAWN = './sounds/sound_01.wav',
    SCORE_1 = './sounds/sound_15.wav',
    SCORE_2 = './sounds/sound_03.wav',
    SCORE_3 = './sounds/sound_02.wav',
    KEY_PRESS = './sounds/sound_14.wav',
    ACTION_1 = './sounds/sound_05.wav',
    ACTION_2 = './sounds/sound_13.wav',
    HIT_1 = './sounds/sound_06.wav',
    HIT_2 = './sounds/sound_08.wav',
    DODGE = './sounds/sound_07.wav',
    DROP = './sounds/sound_11.wav',
    EXPLOSION = './sounds/sound_09.wav',
    GAME_START = './sounds/sound_04.wav',
    SHOT = './sounds/sound_12.wav',
    START_THEME = './sounds/sound_10.wav',
}

/**
 * Enumerates all available control keys.
 *
 * @enum
 */
export enum ControlKey {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    ACTION = 'action',
    POWER = 'power', // on/off
    START_PAUSE = 'start_pause',
    SOUND = 'sound',
    RESET = 'reset',
    EXIT = 'exit',
    COLOR = 'color', // enableColors
}

/**
 * Enumerates all available control event types.
 *
 * @enum
 */
export enum ControlEventType {
    PRESSED = 'pressed',
    HELD = 'held',
}

/**
 * Enumerates all available state properties.
 *
 * @enum
 */
export enum StateProperty {
    ON = 'on',
    START = 'start',
    PLAYING = 'playing',
    GAME_OVER = 'gameOver',
    COLOR_ENABLED = 'colorEnabled',
    MUTED = 'muted',
    HIGH_SCORE = 'highScore',
}
