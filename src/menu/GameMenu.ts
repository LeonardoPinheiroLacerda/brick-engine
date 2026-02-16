import Game from '../core/Game';
import { ControlEventType, ControlKey, FontAlign, FontSize, FontVerticalAlign, Sound, StateProperty } from '../core/types/enums';
import { games } from './artifactory';

export default class GameMenu extends Game {
    private _playedStartTheme: boolean = false;
    private _isGameSelectionOpen: boolean = false;

    private _gameSelectionPointer = 0;

    setupGame() {
        const { state, control, sound } = this.modules;

        state.subscribe(StateProperty.ON, on => {
            if (!on) {
                this._playedStartTheme = false;
            } else {
                // should open game from artifactory, changing the Game instance
            }
        });

        control.subscribe(ControlKey.ACTION, ControlEventType.PRESSED, () => {
            if (this._isGameSelectionOpen === false) {
                this._isGameSelectionOpen = true;
            }
        });

        control.subscribe(ControlKey.LEFT, ControlEventType.PRESSED, () => {
            if (this._isGameSelectionOpen) {
                sound.play(Sound.ACTION_1);
                if (this._gameSelectionPointer === 0) {
                    this._gameSelectionPointer = games.length - 1;
                } else {
                    this._gameSelectionPointer--;
                }
            }
        });

        control.subscribe(ControlKey.RIGHT, ControlEventType.PRESSED, () => {
            if (this._isGameSelectionOpen) {
                sound.play(Sound.ACTION_1);
                if (this._gameSelectionPointer === games.length - 1) {
                    this._gameSelectionPointer = 0;
                } else {
                    this._gameSelectionPointer++;
                }
            }
        });
    }

    processTick() {}
    processFrame() {
        if (!this._isGameSelectionOpen) {
            this._drawWelcome();
        } else {
            this._drawGameSelection();
        }
    }

    private _drawWelcome() {
        const { text, sound } = this.modules;

        if (!this._playedStartTheme) {
            this._playedStartTheme = true;
            sound.play(Sound.START_THEME);
        }

        this.p.push();

        text.setTextSize(FontSize.LARGE);
        text.setActiveText();
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.TOP);

        text.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

        text.setTextSize(FontSize.SMALL);

        text.textOnDisplay('Wellcome to your', { x: 0.5, y: 0.25 });
        text.textOnDisplay('favorite brick game', { x: 0.5, y: 0.32 });
        text.textOnDisplay('simulator!', { x: 0.5, y: 0.39 });
        text.textOnDisplay('Press action', { x: 0.5, y: 0.66 });
        text.textOnDisplay('to continue.', { x: 0.5, y: 0.72 });

        this.p.pop();
    }

    private _drawGameSelection() {
        const { text } = this.modules;

        const { p } = this;
        p.push();

        text.setTextSize(FontSize.LARGE);
        text.setActiveText();
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);

        text.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

        text.setTextSize(FontSize.SMALL);

        text.textOnDisplay('Choose a game and', { x: 0.5, y: 0.25 });
        text.textOnDisplay('Press action to play', { x: 0.5, y: 0.32 });

        text.setTextAlign(FontAlign.RIGHT, FontVerticalAlign.BOTTOM);
        text.textOnDisplay('<', { x: 0.1, y: 0.54 });

        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);
        text.textOnDisplay('>', { x: 0.9, y: 0.54 });

        text.setTextSize(FontSize.MEDIUM);
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);
        text.textOnDisplay(games[this._gameSelectionPointer].name, { x: 0.5, y: 0.55 });

        text.setTextSize(FontSize.EXTRA_SMALL);
        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);

        text.textOnDisplay('Left:    Previous option', { x: 0.05, y: 0.78 });
        text.textOnDisplay('Right:   Next option', { x: 0.05, y: 0.84 });
        text.textOnDisplay('Action:  Select', { x: 0.05, y: 0.9 });

        p.pop();
    }

    getPersistenceKey(): string {
        return 'game-menu';
    }
}
