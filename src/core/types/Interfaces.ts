import { State } from './modules';
import { RendererMetrics } from './Types';

export interface Initializable {
    setup(): void;
}

export interface StateSyncable {
    _state: State;
    syncState(state: State): void;
}

export interface RendererInitializable {
    setup(rendererMetrics: RendererMetrics): void;
}
