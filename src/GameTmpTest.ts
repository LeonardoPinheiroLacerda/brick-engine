import Game from './core/Game';

//Essa classe serve apenas para testes
export default class GameTmpTest extends Game {
    processTick(deltaTime: number) {
        console.log('tick', new Date().getSeconds());
    }
    processFrame() {
        // console.log('frame');
    }
}
