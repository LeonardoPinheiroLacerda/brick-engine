import type GameView from '../view/GameView';
import GameControl from './module/control/GameControl';
import GameGrid from './module/grid/GameGrid';
import GameRenderer from './module/renderer/GameRenderer';
import GameState from './module/state/GameState';
import GameText from './module/text/GameText';
import GameTime from './module/time/GameTime';
import GameSound from './module/sound/GameSound';
import GameScore from './module/score/GameScore';

import { Initializable } from './types/Interfaces';
import { GameModules } from './types/Types';
import GameHudGrid from './module/grid/GameHudGrid';
import InterfaceIdentifierHelper from './helpers/InterfaceIdentifierHelper';
import InitialStateSnapshot from './InitialStateSnapshot';
import GameSession from './module/session/GameSession';
import p5 from 'p5';
import RendererContext from './context/RendererContext';
import GameEventRegistry from './event/GameEventRegistry';
import EventEmitter from './event/EventEmitter';

/**
 * The Central integration boundary encapsulating physical logic away from native visual outputs.
 *
 * Implements the {@link Initializable} configuration pipeline orchestrating completely synchronous
 * frame drawing metrics while processing isolated state iterations without corrupting data models
 * dynamically mapped across various internal UI states.
 */
export default abstract class Game implements Initializable {
    protected _view: GameView;

    private _modules: GameModules = undefined as unknown as GameModules;

    private _initialStateSnapshot = new InitialStateSnapshot();

    private _gameId: string = 'unknown';

    /**
     * Returns the strict string identifier binding data persistently.
     *
     * @returns {string} The namespace mapped internally.
     */
    get gameId(): string {
        return this._gameId;
    }

    /**
     * Sets the application ID establishing persistent memory keys.
     *
     * @param {string} id - The string namespace saving bounds.
     * @returns {void} Returns nothing.
     */
    set gameId(id: string) {
        this._gameId = id;
    }

    /**
     * Constructs the primary controller wrapping native rendering canvases into controlled pipelines.
     *
     * @param {GameView} view - The securely decoupled graphical pointer rendering the root body.
     */
    constructor(view: GameView) {
        this._view = view;
        this._initialStateSnapshot.captureBaseProperties(this);
    }

    /**
     * Yields strictly controlled visibility access to layout injections.
     *
     * @returns {GameView} The configured view instance formatting user HTML constraints.
     */
    get view(): GameView {
        return this._view;
    }

    /**
     * Yields fully configured physics, inputs, and drawing context tools dynamically mapped.
     *
     * @returns {GameModules} A secure aggregate object pointer.
     */
    get modules(): GameModules {
        return this._modules;
    }

    /**
     * Exposes hardware-accelerated processing calls indirectly via Context bounds.
     *
     * @returns {p5} The active executing instance map.
     */
    get p(): p5 {
        return RendererContext.p;
    }

    /**
     * Triggers sequential logic parsing across dynamically subscribed execution containers internally.
     *
     * Internally synchronizes active memory payloads tracking initialization boundaries automatically.
     *
     * @returns {void} Returns nothing.
     */
    setup(): void {
        EventEmitter.clear();
        this._view.build();

        this._modules = {
            renderer: new GameRenderer(),
            grid: new GameGrid(),
            hudGrid: new GameHudGrid(),
            text: new GameText(),
            state: new GameState(),
            control: new GameControl(),
            time: new GameTime(),
            sound: new GameSound(),
            score: new GameScore(),
            session: new GameSession(),
        };

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isInitializable(module)) {
                module.setup();
            }
        });

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isStateSyncable(module)) {
                module.syncState(this._modules.state);
            }
        });

        Object.values(this._modules).forEach(module => {
            if (InterfaceIdentifierHelper.isSerializable(module)) {
                this._modules.session.register(module);
            }
        });

        const { text, control, renderer, session, score } = this._modules;

        session.gameId = this.gameId;
        session.setShowModalFunction(this._view.showSessionModal.bind(this._view));
        session.setResetFunction(this.reset.bind(this));

        control.setModules(this._modules);

        text.setRendererMetrics(renderer.rendererMetrics);

        score.setupGameHighScore(this.gameId);

        this.setupGame();

        GameEventRegistry.setupControlEvents(this._modules, this.reset.bind(this));
        GameEventRegistry.setupStateEvents(this._modules);

        this._view.bindControls(control);

        this._modules.time.captureInitialState();

        this._initialStateSnapshot.captureInitialState(this);
    }

    /**
     * Loops mathematically calculating pixel mutations exactly and logically evaluating system limits.
     *
     * @returns {void} Returns nothing.
     */
    draw(): void {
        const { p } = RendererContext;

        if (!this._modules) return;

        const { renderer, grid, time, state, session } = this._modules;

        if (session.isModalOpen() || (state.isPlaying() && !session.isSessionResolved())) return;

        renderer.render(grid.getGrid(), this._modules);
        if (state.isOn()) {
            if (!state.isStarted()) {
                this.drawTitleScreen();
            } else if (state.isPlaying()) {
                time.update(p.deltaTime);
                // Update time accumulator

                // Process Logic Tick
                if (time.shouldTick()) {
                    this.update(p.deltaTime);

                    this._modules.session.saveSession();
                }

                this.render();
            } else if (state.isPaused()) {
                this.render();
            }

            if (state.isGameOver()) {
                this.drawGameOverScreen();
            }
        }
    }

    /**
     * Orchestrates destruction callbacks erasing references blocking memory sweeps globally.
     *
     * @returns {void} Returns nothing.
     */
    destroy(): void {
        RendererContext.p.noLoop();

        if (this._modules) {
            this._modules.control.unbindControls();
            this._modules.sound.stopAll();
        }
        EventEmitter.clear();
    }

    /**
     * Fires internal overrides mutating internal physics states towards a neutral base metric safely.
     *
     * @returns {void} Returns nothing.
     */
    reset(): void {
        this._modules.grid.resetGrid();
        this._modules.score.resetScore();
        this._modules.score.resetLevel();
        this._modules.time.reset();
        this._modules.session.clearSession();
        this._initialStateSnapshot.restoreInitialState(this);
    }

    /**
     * Subclass abstract delegator resolving physics mathematically based directly on relative speeds.
     *
     * @param {number} deltaTime - Fast ticking number representation capturing elapsed frametimes safely.
     * @returns {void} Returns nothing.
     */
    abstract update(deltaTime: number): void;

    /**
     * Subclass abstract delegator dispatching independent geometry outputs onto the physical UI constraints.
     *
     * @returns {void} Returns nothing.
     */
    abstract render(): void;

    /**
     * Subclass abstract delegator establishing customized rules tracking specific bounds mathematically.
     *
     * @returns {void} Returns nothing.
     */
    abstract setupGame(): void;

    /**
     * Subclass abstract delegator dispatching independent UI strings safely evaluating un-started limits.
     *
     * @returns {void} Returns nothing.
     */
    abstract drawTitleScreen(): void;

    /**
     * Subclass abstract delegator dispatching independent UI strings safely evaluating finished bounds.
     *
     * @returns {void} Returns nothing.
     */
    abstract drawGameOverScreen(): void;
}
