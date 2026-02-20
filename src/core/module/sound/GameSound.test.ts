/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameSound from './GameSound';
import { State } from '../../types/modules';
import { Sound } from '../../types/enums';

describe('GameSound', () => {
    let gameSound: GameSound;
    let mockState: State;
    let mockAudioContext: {
        createGain: () => void;
        createBufferSource: () => void;
        destination: Record<string, unknown>;
        currentTime: number;
        resume: () => Promise<void>;
        decodeAudioData: () => Promise<Record<string, unknown>>;
        state: string;
    };
    let mockGainNode: {
        connect: () => void;
        gain: {
            setValueAtTime: (value: number, time: number) => void;
        };
    };

    beforeEach(() => {
        // [ARRANGE] Mock GainNode
        mockGainNode = {
            connect: vi.fn(),
            gain: {
                setValueAtTime: vi.fn(),
            },
        };

        // [ARRANGE] Mock AudioContext
        mockAudioContext = {
            createGain: vi.fn().mockReturnValue(mockGainNode),
            createBufferSource: vi.fn().mockReturnValue({
                connect: vi.fn(),
                start: vi.fn(),
                stop: vi.fn(),
                buffer: null,
                onended: null,
            }),
            destination: {},
            currentTime: 0,
            resume: vi.fn().mockResolvedValue(undefined),
            decodeAudioData: vi.fn().mockResolvedValue({}),
            state: 'running',
        };

        // We use vi.fn because jsdom window doesn't have AudioContext
        vi.stubGlobal(
            'AudioContext',
            vi.fn().mockImplementation(function () {
                return mockAudioContext as unknown as AudioContext;
            }),
        );
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
            }),
        );

        mockState = {
            isMuted: vi.fn().mockReturnValue(false),
            subscribe: vi.fn(),
            toggleMuted: vi.fn(),
        } as unknown as State;

        gameSound = new GameSound();
        gameSound.syncState(mockState);
    });

    describe('setup', () => {
        it('should initialize AudioContext and GainNode', () => {
            // [ACT]
            gameSound.setup();

            // [ASSERT]
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
        });
    });

    describe('toggleMute', () => {
        it('should call state.toggleMuted and update gain', () => {
            // [ARRANGE]
            gameSound.setup();

            // [ACT]
            gameSound.toggleMute();

            // [ASSERT]
            expect(mockState.toggleMuted).toHaveBeenCalled();
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalled();
        });
    });

    describe('play', () => {
        it('should resume context if suspended and play sound', async () => {
            // [ARRANGE]
            mockAudioContext.state = 'suspended';
            gameSound.setup();

            (gameSound as unknown as { _buffers: Map<Sound, AudioBuffer> })['_buffers'].set(Sound.SPAWN, {} as AudioBuffer);

            // [ACT]
            await gameSound.play(Sound.SPAWN);

            // [ASSERT]
            expect(mockAudioContext.resume).toHaveBeenCalled();
            expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
        });
    });
});
