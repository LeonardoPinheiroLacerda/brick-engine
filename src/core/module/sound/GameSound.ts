import configs from '../../../config/configs';
import { Sound, StateProperty } from '../../types/enums';
import { Debuggable, StateSyncable } from '../../types/Interfaces';
import { SoundModule, State } from '../../types/modules';

/**
 * Module responsible for managing non-blocking audio playback and preloading sound effects.
 *
 * It decouples the raw Web Audio API context management away from generic gameplay
 * components. By abstracting buffer decoding, volume/gain adjustments, and muting, it
 * allows systems to simply request `play(Sound.BEEP)` without managing individual audio nodes.
 * Implements {@link StateSyncable} to actively listen to mute changes from the global state.
 */
export default class GameSound implements SoundModule, StateSyncable, Debuggable {
    muted: boolean;

    /**
     * The AudioContext is the primary "audio engine" for the browser.
     * It manages all sound creation and playback.
     */
    private _audioContext: AudioContext;

    /**
     * The GainNode controls the volume (gain) of the audio.
     * All sounds pass through this node before reaching the destination (speakers).
     */
    private _gainNode: GainNode;

    /**
     * Stores loaded sound buffers in memory.
     * AudioBuffer contains the decoded audio data ready for playback.
     */
    private _buffers: Map<Sound, AudioBuffer> = new Map();

    /**
     * Tracks currently playing sound sources.
     * Required to stop specific sounds (like background music or loops).
     */
    private _activeSources: Map<Sound, AudioBufferSourceNode[]> = new Map();

    private _volume: number = 1.0;

    _state: State;

    /**
     * Initializes the sound system and buffer caching.
     * Creates the core standard `AudioContext`, sets up the master audio routing
     * `GainNode` for volume adjustment, and kicks off asynchronous background downloading
     * of all game sound assets.
     *
     * @returns {void} Returns nothing.
     */
    setup() {
        const { volume } = configs.game.sound;
        this._volume = volume;

        // Initialize AudioContext.
        // The 'webkit' prefix is for compatibility with older browsers (e.g., older Safari).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this._audioContext = new AudioContextClass({ latencyHint: 'interactive' });

        // Create the master volume node (GainNode).
        this._gainNode = this._audioContext.createGain();

        // Connect the GainNode to the "destination" (device audio output).
        // Flow: Sound Source -> GainNode -> Destination (Speakers)
        this._gainNode.connect(this._audioContext.destination);

        this._updateGain();
        this._loadAll();
    }

    /**
     * Instantiates an active playback stream for a specific preloaded sound effect.
     *
     * To prevent overlapping audio collision, this creates a new `BufferSource` node
     * for every individual playback call.
     *
     * @param {Sound} sound - The precise enum identity of the targeted soundtrack/effect file to trigger.
     * @returns {Promise<void>} An asynchronous void promise that resolves immediately upon commanding the API.
     */
    async play(sound: Sound): Promise<void> {
        // Browsers block automatic audio until user interaction.
        // If suspended, try to wake up the AudioContext.
        if (this._audioContext.state === 'suspended') {
            this._audioContext.resume();
        }

        const buffer = this._buffers.get(sound);
        if (!buffer) {
            console.warn(`Sound buffer not found for: ${sound}`);
            return;
        }

        // To play a sound, we create a "source" (SourceNode).
        // Each sound played needs a new SourceNode. They are disposable (fire-and-forget).
        const source = this._audioContext.createBufferSource();
        source.buffer = buffer;

        // Connect the source to our master volume control.
        source.connect(this._gainNode);

        // Track the active source so we can stop it if necessary.
        if (!this._activeSources.has(sound)) {
            this._activeSources.set(sound, []);
        }
        const sources = this._activeSources.get(sound)!;
        sources.push(source);

        // When the sound finishes playing, remove from active list to free memory.
        source.onended = () => {
            const index = sources.indexOf(source);
            if (index > -1) {
                sources.splice(index, 1);
            }
        };

        // Start playback immediately (0).
        source.start(0);
    }

    /**
     * Purges and forcefully stops all active playback instances of a specific sound.
     *
     * @param {Sound} sound - The exact enum identity of the looping audio channel to abruptly halt.
     * @returns {Promise<void>} An asynchronous void promise resolving upon completion.
     */
    async stop(sound: Sound): Promise<void> {
        const sources = this._activeSources.get(sound);
        if (sources) {
            sources.forEach(source => {
                try {
                    // Stop playback immediately.
                    source.stop();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    // Ignore errors if already stopped.
                }
            });
            sources.length = 0;
        }
    }

    /**
     * A global panic method that physically stops every localized sound immediately
     * looping in the actively managed list.
     *
     * @returns {Promise<void>} An asynchronous void promise resolving after mass stopping concludes.
     */
    async stopAll(): Promise<void> {
        const activeSounds = Array.from(this._activeSources.keys());
        for (const sound of activeSounds) {
            await this.stop(sound);
        }
    }

    /**
     * Internal utility to update the master audio routing node based on active configuration limits.
     *
     * @returns {void} Returns nothing.
     */
    private _updateGain() {
        // setValueAtTime is the safe way to change audio parameters in Web Audio API.
        // If muted, volume is 0. Otherwise, use configured volume.
        const isMuted = this._state ? this._state.isMuted() : false;

        if (!this._gainNode) {
            return;
        }

        if (isMuted) {
            this._gainNode.gain.setValueAtTime(0, this._audioContext.currentTime);
        } else {
            this._gainNode.gain.setValueAtTime(this._volume, this._audioContext.currentTime);
        }
    }

    /**
     * Preloads and decodes binary chunks for all physical asset bundles defined in the `Sound` configuration.
     *
     * @returns {Promise<void>} An asynchronous void promise resolving upon resolving all fetch requests.
     */
    private async _loadAll() {
        // Load all sounds defined in the Sound Enum.
        // Fetch -> ArrayBuffer -> Decode -> AudioBuffer
        const loadPromises = Object.values(Sound).map(async soundUrl => {
            try {
                const response = await fetch(soundUrl);
                const arrayBuffer = await response.arrayBuffer();
                // Decoding is heavy, so we do this at the start (loading).
                const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
                this._buffers.set(soundUrl as Sound, audioBuffer);
            } catch (error) {
                console.error(`Failed to load sound: ${soundUrl}`, error);
            }
        });

        await Promise.all(loadPromises);
    }

    /**
     * Public proxy bound cleanly to the internal UI to swap the active muting preference stringent rule.
     *
     * @returns {void} Returns nothing.
     */
    toggleMute(): void {
        this._state.toggleMuted();
        this._updateGain();
    }

    /**
     * Hook implemented to attach contextual state triggers immediately after standard `setup` completes.
     * Subscribes to the single source of truth {@link GameState} to actively track the `MUTED` flag.
     *
     * @param {State} state - The injected active singleton logic state context instance to observe securely.
     * @returns {void} Returns nothing.
     */
    syncState(state: State): void {
        this._state = state;
        state.subscribe(StateProperty.MUTED, () => {
            this._updateGain();
        });

        // Ensure the initial state is applied when synced
        this._updateGain();
    }

    /**
     * Collects and exposes internal mapping metrics required by the Engine's Real-time Development Monitor.
     *
     * @returns {Record<string, string | number | boolean>} A shallow payload containing current buffering counts and audio scaling rules.
     */
    getDebugData(): Record<string, string | number | boolean> {
        let activeSourcesCount = 0;
        this._activeSources.forEach(sources => (activeSourcesCount += sources.length));

        return {
            muted: this._state ? this._state.isMuted() : false,
            volume: this._volume,
            active_sources: activeSourcesCount,
            loaded_buffers: this._buffers.size,
        };
    }
}
