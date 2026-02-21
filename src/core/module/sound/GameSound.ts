import configs from '../../../config/configs';
import { Sound, StateProperty } from '../../types/enums';
import { Debuggable, StateSyncable } from '../../types/Interfaces';
import { SoundModule, State } from '../../types/modules';

/**
 * Manages audio playback and sound effects.
 * Handles the Web Audio API context, loading sound buffers, and managing volume/muting.
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
     * Initializes the sound system.
     * Creates the AudioContext, sets up the master gain node, and starts loading sounds.
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
     * Plays a specific sound effect.
     * Creates a new source node for each playback instance.
     *
     * @param {Sound} sound - The sound identifier/URL to play.
     * @returns {Promise<void>}
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
     * Stops all instances of a specific sound.
     *
     * @param {Sound} sound - The sound to stop.
     * @returns {Promise<void>}
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
     * Stops all currently playing sounds.
     *
     * @returns {Promise<void>}
     */
    async stopAll(): Promise<void> {
        const activeSounds = Array.from(this._activeSources.keys());
        for (const sound of activeSounds) {
            await this.stop(sound);
        }
    }

    /**
     * Updates the master volume based on the muted state.
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
     * Loads all sound assets defined in the Sound enum.
     * Fetches, buffers, and decodes the audio data.
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
     * Toggles the mute state of the game.
     * Updates the state module and the audio gain.
     */
    toggleMute(): void {
        this._state.toggleMuted();
        this._updateGain();
    }

    /**
     * Receives the shared game state module.
     * Subscribes to mute state changes.
     *
     * @param {State} state - The game state module.
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
     * Retrieves debug information about the audio system.
     *
     * @returns {Record<string, string | number | boolean>} The debug data.
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
