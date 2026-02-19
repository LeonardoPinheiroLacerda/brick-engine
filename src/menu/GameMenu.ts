import Game from '../core/Game';
import { ControlEventType, ControlKey, FontAlign, FontSize, FontVerticalAlign, Sound, StateProperty } from '../core/types/enums';
import GameRepository from './GameRepository';
import GameManager from './manager/GameManager';

export default class GameMenu extends Game {
    private _gameSelectionPointer = 0;
    private _isLoading = false;

    private _gameRepository = new GameRepository();
    private _gameManager = new GameManager();

    setupGame() {
        const { state, control, sound } = this.modules;

        control.subscribe(ControlKey.ACTION, ControlEventType.PRESSED, () => {
            if (this._isLoading) return;

            if (state.isStarted()) {
                const selectedGame = this._gameRepository.games[this._gameSelectionPointer];
                this._gameManager.handleGameSwitch(selectedGame, this);
            }
        });

        control.subscribe(ControlKey.LEFT, ControlEventType.PRESSED, () => {
            if (state.isPlaying()) {
                sound.play(Sound.ACTION_1);
                if (this._gameSelectionPointer === 0) {
                    this._gameSelectionPointer = this._gameRepository.games.length - 1;
                } else {
                    this._gameSelectionPointer--;
                }
            }
        });

        control.subscribe(ControlKey.RIGHT, ControlEventType.PRESSED, () => {
            if (state.isPlaying()) {
                sound.play(Sound.ACTION_1);
                if (this._gameSelectionPointer === this._gameRepository.games.length - 1) {
                    this._gameSelectionPointer = 0;
                } else {
                    this._gameSelectionPointer++;
                }
            }
        });

        state.subscribe(StateProperty.ON, on => {
            if (on) {
                sound.play(Sound.START_THEME);
            }
        });
    }

    update() {}

    render() {
        const { text } = this.modules;

        const { p } = this;
        p.push();

        text.setTextSize(FontSize.LARGE);
        text.setActiveText();
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);

        text.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

        text.setTextSize(FontSize.SMALL);

        text.textOnDisplay('Choose a game and', { x: 0.5, y: 0.25 });
        text.textOnDisplay('Press start to play', { x: 0.5, y: 0.32 });

        text.setTextAlign(FontAlign.RIGHT, FontVerticalAlign.BOTTOM);
        text.textOnDisplay('<', { x: 0.1, y: 0.54 });

        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);
        text.textOnDisplay('>', { x: 0.9, y: 0.54 });

        text.setTextSize(FontSize.MEDIUM);
        text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);
        text.textOnDisplay(this._gameRepository.games[this._gameSelectionPointer].name, { x: 0.5, y: 0.55 });

        text.setTextSize(FontSize.EXTRA_SMALL);
        text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);

        text.textOnDisplay('Left:    Previous option', { x: 0.05, y: 0.78 });
        text.textOnDisplay('Right:   Next option', { x: 0.05, y: 0.84 });
        text.textOnDisplay('Action:  Select', { x: 0.05, y: 0.9 });

        p.pop();
    }

    drawTitleScreen() {
        const { text } = this.modules;

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

    drawGameOverScreen() {
        // Menu doesn't have a game over screen
    }

    getPersistenceKey(): string {
        return 'game-menu';
    }
}
