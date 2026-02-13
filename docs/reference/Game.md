# Game Class Reference

The `Game` class is the heart of your application. It initializes all necessary modules and sets up the main game loop.

## Inheritance

Your game class must extend `Game`.

```typescript
import Game from '../core/Game';

class MyGame extends Game { ... }
```

## Properties

| Property  | Type          | Description                                         |
| :-------- | :------------ | :-------------------------------------------------- |
| `modules` | `GameModules` | Access to all engine modules (grid, control, etc.). |

## Abstract Methods to Implement

### `processTick(deltaTime: number): void`

This method is called once per "Game Tick". The frequency of ticks is determined by `configs.game.tickInterval`.

- **Usage**: Implement your core game logic here (movement, rules, collisions).
- **deltaTime**: Time elapsed since the last tick (in ms).

### `processFrame(): void`

This method is called every frame (typically 60 times per second, dependent on `configs.game.frameInterval`).

- **Usage**: Implement visual-only updates here (particles, smooth animations).
- **Note**: The main grid rendering is handled automatically by the engine _before_ this method is called.

## Accessing Modules

You can access any module via `this.modules`.

```typescript
const { grid, control, state, text, time } = this.modules;

// Example: Move a piece
if (control.isPressed('DOWN')) {
    // ...
}
```
