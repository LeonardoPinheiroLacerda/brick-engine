import Game from './core/Game';
import { ControlEventType, ControlKey, Sound } from './core/types/enums';

//Essa classe serve apenas para testes
export default class GameTmpTest extends Game {
    setupGame() {
        const { sound, control, state } = this.modules;
        state.muted = false;

        control.subscribe(ControlKey.ACTION, ControlEventType.PRESSED, () => {
            sound.play(Sound.ACTION_1);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    processTick(deltaTime: number) {
        console.log('tick', new Date().getSeconds());
    }
    processFrame() {
        // console.log('frame');
    }

    getPersistenceKey(): string {
        return 'game-tmp-test';
    }
}
