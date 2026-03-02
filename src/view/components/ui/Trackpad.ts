import p5 from 'p5';
import configs from '../../../config/configs';
import RendererContext from '../../../core/context/RendererContext';
import ControlInputHandlerHelper from '../../../core/helpers/ControlInputHandlerHelper';
import { ControlKey } from '../../../core/types/enums';

export default class Trackpad {
    private _container: p5.Element;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _inputHandler: ControlInputHandlerHelper;

    private _isDrawing = false;
    private _startX = 0;
    private _startY = 0;
    private _maxDist = 0;
    private _lastDirection: ControlKey | null = null;

    private _threshold = 30;
    private _tapThreshold = 10;

    private _animationFrameId: number;
    private _points: { x: number; y: number }[] = [];

    constructor(parent: p5.Element, inputHandler: ControlInputHandlerHelper) {
        this._inputHandler = inputHandler;
        const { p } = RendererContext;

        this._container = p.createDiv();
        this._container.parent(parent);
        this._container.addClass('trackpad-surface');

        const hintText = p.createP('Swipe for Directions<br/>Tap for Action');
        hintText.parent(this._container);
        hintText.addClass('trackpad-hint');

        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('trackpad-canvas');

        (this._container.elt as HTMLElement).appendChild(this._canvas);
        this._ctx = this._canvas.getContext('2d')!;

        // Use ResizeObserver to keep canvas drawing buffer matched to its visual size
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this._canvas.width = entry.contentRect.width;
                this._canvas.height = entry.contentRect.height;
            }
        });
        resizeObserver.observe(this._container.elt);

        this._bindEvents();
        this._loop();
    }

    private _bindEvents() {
        const elt = this._container.elt as HTMLElement;
        elt.addEventListener('pointerdown', this._onPointerDown.bind(this));
        elt.addEventListener('pointermove', this._onPointerMove.bind(this));
        elt.addEventListener('pointerup', this._onPointerUp.bind(this));
        elt.addEventListener('pointercancel', this._onPointerUp.bind(this));
        elt.addEventListener('pointerout', this._onPointerUp.bind(this));
        elt.addEventListener('contextmenu', e => e.preventDefault());
    }

    private _getCoords(e: PointerEvent) {
        const rect = (this._container.elt as HTMLElement).getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    private _onPointerDown(e: PointerEvent) {
        this._isDrawing = true;
        const { x, y } = this._getCoords(e);
        this._startX = x;
        this._startY = y;
        this._maxDist = 0;
        this._lastDirection = null;
        this._points = [{ x, y }];
        e.preventDefault();
        (this._container.elt as HTMLElement).setPointerCapture(e.pointerId);
    }

    private _onPointerMove(e: PointerEvent) {
        if (!this._isDrawing) return;

        const { x, y } = this._getCoords(e);
        this._points.push({ x, y });

        const dx = x - this._startX;
        const dy = y - this._startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > this._maxDist) {
            this._maxDist = dist;
        }

        if (dist > this._threshold) {
            let newDir: ControlKey;
            if (Math.abs(dx) > Math.abs(dy)) {
                newDir = dx > 0 ? ControlKey.RIGHT : ControlKey.LEFT;
            } else {
                newDir = dy > 0 ? ControlKey.DOWN : ControlKey.UP;
            }

            if (this._lastDirection !== newDir) {
                if (this._lastDirection) {
                    this._inputHandler.handleRelease(this._lastDirection);
                }
                this._inputHandler.handlePress(newDir);
                this._lastDirection = newDir;

                // Reset start to current so we require new movement threshold for direction change
                // (or we can keep it relative to start for continuous joystick feel, let's keep continuous for now)
            }
        }
        e.preventDefault();
    }

    private _onPointerUp(e: PointerEvent) {
        if (!this._isDrawing) return;
        this._isDrawing = false;

        if (this._lastDirection) {
            this._inputHandler.handleRelease(this._lastDirection);
            this._lastDirection = null;
        } else if (this._maxDist < this._tapThreshold) {
            // Treat as tap!
            this._inputHandler.handlePress(ControlKey.ACTION);
            setTimeout(() => this._inputHandler.handleRelease(ControlKey.ACTION), 50);
        }
        (this._container.elt as HTMLElement).releasePointerCapture(e.pointerId);
    }

    private _loop = () => {
        if (this._ctx) {
            // Fade out the trail
            this._ctx.globalCompositeOperation = 'destination-out';
            this._ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

            this._ctx.globalCompositeOperation = 'source-over';

            // Draw new segment
            if (this._isDrawing && this._points.length > 1) {
                this._ctx.beginPath();
                this._ctx.strokeStyle = configs.colors.bodyButton; // Using the button main color as trail
                this._ctx.lineWidth = 6;
                this._ctx.lineCap = 'round';
                this._ctx.lineJoin = 'round';

                const lastPoint = this._points[this._points.length - 1];
                const prevPoint = this._points[this._points.length - 2];
                this._ctx.moveTo(prevPoint.x, prevPoint.y);
                this._ctx.lineTo(lastPoint.x, lastPoint.y);
                this._ctx.stroke();
            }
        }
        this._animationFrameId = requestAnimationFrame(this._loop);
    };

    public destroy() {
        cancelAnimationFrame(this._animationFrameId);
        this._container.remove();
    }
}
