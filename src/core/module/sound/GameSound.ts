import configs from '../../../config/configs';
import { Sound } from '../../types/enums';
import { Sound as SoundInterface } from '../../types/modules';

export default class GameSound implements SoundInterface {
    // O AudioContext é o "motor" de áudio do navegador.
    // Ele gerencia toda a criação e reprodução de sons.
    // Pense nele como uma mesa de som virtual.
    private _audioContext: AudioContext;

    // O GainNode é um "nó" que controla o volume.
    // Todos os sons passam por ele antes de ir para a saída (caixas de som).
    private _gainNode: GainNode;

    // Armazena os sons carregados na memória.
    // AudioBuffer é o áudio decodificado (PCM data) pronto para tocar.
    private _buffers: Map<Sound, AudioBuffer> = new Map();

    // Rastreia os sons que estão tocando no momento.
    // Necessário para poder parar sons específicos (como música de fundo ou loops).
    private _activeSources: Map<Sound, AudioBufferSourceNode[]> = new Map();

    private _mute: boolean = false;
    private _volume: number = 1.0;

    setup() {
        const { volume } = configs.game.sound;
        this._volume = volume;

        // Inicializa o AudioContext.
        // O sufixo 'webkit' é para compatibilidade com navegadores mais antigos (Safari antigo).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this._audioContext = new AudioContextClass({ latencyHint: 'interactive' });

        // Cria o nó de volume mestre (GainNode).
        this._gainNode = this._audioContext.createGain();

        // Conecta o GainNode ao "destino" (saída de áudio do dispositivo).
        // Fluxo: Fonte de Som -> GainNode -> Destino (Caixas de Som)
        this._gainNode.connect(this._audioContext.destination);

        this._updateGain();
        this._loadAll();
    }

    async play(sound: Sound): Promise<void> {
        // Navegadores bloqueiam áudio automático até que o usuário interaja com a página.
        // Se estiver suspenso, tentamos acordar o AudioContext.
        if (this._audioContext.state === 'suspended') {
            this._audioContext.resume();
        }

        const buffer = this._buffers.get(sound);
        if (!buffer) {
            console.warn(`Sound buffer not found for: ${sound}`);
            return;
        }

        // Para tocar um som, criamos uma "fonte" (SourceNode).
        // Cada som tocado precisa de um novo SourceNode. Eles são descartáveis (fire-and-forget).
        const source = this._audioContext.createBufferSource();
        source.buffer = buffer;

        // Conectamos a fonte ao nosso controle de volume mestre.
        source.connect(this._gainNode);

        // Rastreia a fonte ativa para podermos pará-la se necessário.
        if (!this._activeSources.has(sound)) {
            this._activeSources.set(sound, []);
        }
        const sources = this._activeSources.get(sound)!;
        sources.push(source);

        // Quando o som terminar de tocar, removemos da lista de ativos para liberar memória.
        source.onended = () => {
            const index = sources.indexOf(source);
            if (index > -1) {
                sources.splice(index, 1);
            }
        };

        // Inicia a reprodução imediatamente (0).
        source.start(0);
    }

    async stop(sound: Sound): Promise<void> {
        const sources = this._activeSources.get(sound);
        if (sources) {
            sources.forEach(source => {
                try {
                    // Para a reprodução imediatamente.
                    source.stop();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    // Ignora erros se já estiver parado.
                }
            });
            sources.length = 0;
        }
    }

    async stopAll(): Promise<void> {
        const activeSounds = Array.from(this._activeSources.keys());
        for (const sound of activeSounds) {
            await this.stop(sound);
        }
    }

    set muted(value: boolean) {
        this._mute = value;
        this._updateGain();
    }

    private _updateGain() {
        // setValueAtTime é a forma segura de mudar parâmetros de áudio no Web Audio API.
        // Se mudo, volume é 0. Se não, usa o volume configurado.
        if (this._mute) {
            this._gainNode.gain.setValueAtTime(0, this._audioContext.currentTime);
        } else {
            this._gainNode.gain.setValueAtTime(this._volume, this._audioContext.currentTime);
        }
    }

    private async _loadAll() {
        // Carrega todos os sons definidos no Enum Sound.
        // Fetch -> ArrayBuffer -> Decode -> AudioBuffer
        const loadPromises = Object.values(Sound).map(async soundUrl => {
            try {
                const response = await fetch(soundUrl);
                const arrayBuffer = await response.arrayBuffer();
                // A decodificação é pesada, por isso fazemos isso no início (loading).
                const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
                this._buffers.set(soundUrl as Sound, audioBuffer);
            } catch (error) {
                console.error(`Failed to load sound: ${soundUrl}`, error);
            }
        });

        await Promise.all(loadPromises);
    }
}
