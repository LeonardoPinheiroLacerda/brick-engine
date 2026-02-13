# Brick Engine Documentation

## Objective

The **Brick Engine** is a modular, TypeScript-based game engine designed for creating retro grid-based games (like Tetris, Snake, Breakout) that run in a browser. It leverages **P5.js** for rendering and simulates the experience of a classic handheld gaming device, complete with a dot-matrix style display, a HUD (Head-Up Display), and physical button controls.

## Key Features

- **Grid-Based Logic**: Built-in support for 2D grid management, collision detection, and row/column manipulations.
- **Retro Aesthetic**: Simulates a physical device with customizable colors and responsive layout.
- **Modular Architecture**: core functionality is split into distinct modules (Grid, Control, Renderer, State, Text, Time) for clean separation of concerns.
- **Input Handling**: Unified control system supporting keyboard and on-screen button inputs.
- **Game Loop**: Separated logic ticks (game speed) from rendering frames (60fps smooth animations).

## Getting Started

To create a game, you must extend the abstract `Game` class and implement its core abstract methods.

### Example

```typescript
import Game from './core/Game';

export default class MyGame extends Game {
    // Called every game tick (controlled by tickInterval)
    // Use this for game logic: movement, collision, state updates
    processTick(deltaTime: number) {
        // ... game logic ...
    }

    // Called every frame (60 times per second)
    // Use this for visual effects or animations independent of game logic
    processFrame() {
        // ... visual effects ...
    }
}
```

## Structure

The engine is organized into the following core modules:

- [Game (Core)](docs/reference/Game.md) - The main entry point and orchestrator.
- [GameGrid](docs/reference/GameGrid.md) - Manages the 2D grid state, cells, and collision.
- [GameControl](docs/reference/GameControl.md) - Handles user input from keyboard and UI buttons.
- [GameRenderer](docs/reference/GameRenderer.md) - Handles drawing the grid and UI to the canvas.
- [GameState](docs/reference/GameState.md) - Manages global game states (Running, Paused, Game Over).
- [GameText](docs/reference/GameText.md) - Renders retro-style text on the specific grid areas.
- [GameTime](docs/reference/GameTime.md) - Manages the game loop and speed (tick rate).
