# Documentation Standard (JSDoc)

This document establishes the standards for documenting code in this project using JSDoc.
The goal is to provide a clear, technical, and detailed reference for all developers.

## General Principles

1.  **Language**: All documentation must be written in **English**.
2.  **Tone**: Technical, concise, and descriptive. Avoid first-person ("I", "we").
3.  **Completeness**: All exported functions, classes, methods, and interfaces must be documented.

## Typing Requirement

Strict typing is **mandatory** for all methods and functions documented.

- **Inputs**: All parameters must have their types explicitly declared in JSDoc (`@param {Type} name`).
- **Outputs**: All methods/functions must explicitly declare their return type (`@returns {Type}` or `@returns {void}`).

## Classes

Classes must have a description explaining their responsibility.
**CRITICAL**: All class public properties must be documented, explaining what they store.

### Example

```typescript
/**
 * Manages the game view layer and user interactions.
 *
 * Orchestrates the rendering of components and binds DOM events to game logic.
 */
export default class GameView {
    private p: P5;

    /**
     * The parent HTML element where the game is mounted.
     */
    public parent: HTMLElement;

    /**
     * Creates an instance of GameView.
     *
     * @param {P5} p - The P5 instance.
     * @param {HTMLElement} parent - The container element.
     */
    constructor(p: P5, parent: HTMLElement) {
        this.p = p;
        this.parent = parent;
    }
}
```

## Functions and Methods

Every function must explain **what** it does, **how** it behaves (if complex), and describing all parameters and return values.

### Structure

1.  **Short Description**: One-line summary.
2.  **Detailed Description**: (Optional) More context, side-effects, or algorithm details.
3.  **@param**: One for each argument, with type and description.
4.  **@returns**: The return type and description of what is returned.

### Example

```typescript
/**
 * Calculates the optimal dimensions for the game container.
 *
 * It ensures the container maintains the aspect ratio defined by constants
 * while fitting within the parent element's bounds.
 *
 * @param {number} availableWidth - The maximum available width in pixels.
 * @param {number} availableHeight - The maximum available height in pixels.
 * @returns {Dimensions} An object containing the calculated width and height.
 */
function calculateDimensions(availableWidth: number, availableHeight: number): Dimensions {
    // ...
}
```

## Interfaces and Types

Interfaces must describe what object shape they represent and document each property.

### Example

```typescript
/**
 * Represents the layout response containing container references.
 */
interface ButtonLayoutResponse {
    /** The container for small system buttons (e.g., Reset, Power). */
    smallButtonContainer: P5.Element;

    /** The container for directional buttons. */
    mediumButtonContainer: P5.Element;
}
```
