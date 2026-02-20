/**
 * Enumerates all available colors for grid cells and UI elements.
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
 * Enumerates all available horizontal text alignments.
 */
export enum FontAlign {
    /** Aligns text to the center. */
    CENTER = 'center',
    /** Aligns text to the left. */
    LEFT = 'left',
    /** Aligns text to the right. */
    RIGHT = 'right',
}

/**
 * Enumerates all available font size presets.
 * These correspond to specific pixel values calculated at runtime based on screen size.
 */
export enum FontSize {
    EXTRA_SMALL = 0,
    SMALL = 1,
    MEDIUM = 2,
    LARGE = 3,
    EXTRA_LARGE = 4,
}

/**
 * Enumerates all available vertical text alignments.
 */
export enum FontVerticalAlign {
    /** Aligns text to the vertical center. */
    CENTER = 'center',
    /** Aligns text to the top. */
    TOP = 'top',
    /** Aligns text to the bottom. */
    BOTTOM = 'bottom',
}

/**
 * Enumerates all available sound assets.
 * Each value corresponds to the path of the audio file.
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
 * Enumerates all logical control keys used in the engine.
 * These are mapped to physical keys in the Control module.
 */
export enum ControlKey {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    ACTION = 'action',
    POWER = 'power',
    START_PAUSE = 'start_pause',
    SOUND = 'sound',
    RESET = 'reset',
    EXIT = 'exit',
    COLOR = 'color',
}

/**
 * Enumerates the types of input events.
 */
export enum ControlEventType {
    /** Triggered once when the key is pressed down. */
    PRESSED = 'pressed',
    /** Triggered continuously while the key is held down. */
    HELD = 'held',
}

/**
 * Enumerates all observable state properties.
 * These keys are used for state subscriptions and persistence.
 */
export enum StateProperty {
    ON = 'on',
    START = 'start',
    PLAYING = 'playing',
    GAME_OVER = 'gameOver',
    COLOR_ENABLED = 'colorEnabled',
    MUTED = 'muted',
}
