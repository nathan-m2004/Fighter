import Movement from "./Movement";

export type InputState = {
    key: string;
    gamepadKey: number;
    gamepadAxe: { index: number; negative: boolean };
    pressed: boolean;
    startFramehold: number;
    timeHoldingFrames: number;
};

export type FrameState = { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };

export type Velocity = { x: number; y: number };

export type Position = { x: number; y: number };

export type Keys = {
    lightAttack: InputState;
    left: InputState;
    right: InputState;
    up: InputState;
    down: InputState & { delayToLeavePlataform: number };
    dash: InputState;
    jump: InputState;
};

export default class Player {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    color: string;
    position: Position;
    velocity: Velocity;
    gravity: number;
    size: { width: number; height: number };
    frames: FrameState;
    keys: Keys;
    dummy: boolean;
    movement: Movement;
    gamepad: { index: number };
    debugInfo: boolean;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        this.canvas = canvas;
        this.context = context;
        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };

        this.color = "red";
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 80, height: 80 };

        this.gravity = gravity;
        this.movement = new Movement();

        this.dummy = false;
        this.debugInfo = false;

        this.gamepad = { index: undefined };
        this.keys = {
            left: {
                key: "KeyA",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
            right: {
                key: "KeyD",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
            up: {
                key: "KeyW",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
            down: {
                key: "KeyS",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
                delayToLeavePlataform: 80,
            },
            dash: {
                key: "ShiftLeft",
                gamepadKey: 9,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
            jump: {
                key: "Space",
                gamepadKey: 0,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
            lightAttack: {
                key: "KeyJ",
                gamepadKey: 3,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingFrames: 0,
            },
        };
        window.addEventListener("keydown", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    if (!action.pressed) {
                        action.timeHoldingFrames = 0;
                        action.startFramehold = this.frames.currentFrame;
                        action.pressed = true;
                    }
                }
            });
        });
        window.addEventListener("keyup", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    action.pressed = false;
                    action.timeHoldingFrames = 0;
                }
            });
        });
    }
    countTimeHoldingKey() {
        Object.values(this.keys).forEach((action) => {
            if (action.pressed) {
                action.timeHoldingFrames = this.frames.currentFrame - action.startFramehold;
            }
        });
    }
    gamepadUpdate() {
        const gamepad = navigator.getGamepads()[this.gamepad.index];
        if (!gamepad) return;

        for (const key of Object.keys(this.keys) as Array<keyof Keys>) {
            const button = this.keys[key];

            if (button.gamepadKey !== undefined) {
                if (gamepad.buttons[button.gamepadKey].pressed) {
                    if (!button.pressed) {
                        button.timeHoldingFrames = 0;
                        button.startFramehold = this.frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingFrames = 0;
                }
            }

            if (button.gamepadAxe !== undefined) {
                if (
                    button.gamepadAxe.negative
                        ? gamepad.axes[button.gamepadAxe.index] <= -0.2
                        : gamepad.axes[button.gamepadAxe.index] >= 0.2
                ) {
                    if (!button.pressed) {
                        button.timeHoldingFrames = 0;
                        button.startFramehold = this.frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingFrames = 0;
                }
            }
        }
    }
    physics() {
        if (!this.movement.dashing) {
            this.velocity.y += this.gravity * this.frames.deltaTime;
        }

        this.position.x += this.velocity.x * this.frames.deltaTime;
        this.position.y += this.velocity.y * this.frames.deltaTime;
    }
    draw() {
        this.context.fillStyle = this.color;
        if (this.movement.dashing) {
            this.context.fillStyle = "green";
        }
        this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        if (this.debugInfo) {
            this.context.fillStyle = "white"; // Set a color for the text
            this.context.font = "16px Arial"; // Set the font and size
            this.context.fillText(
                `Position: (${this.position.x.toFixed(0)}, ${this.position.y.toFixed(0)}), onGround: (${this.movement.onGround})`,
                10,
                20
            );
            this.context.fillText(`Velocity: (${this.velocity.x.toFixed(1)}, ${this.velocity.y.toFixed(1)})`, 10, 40);
            this.context.fillText(`Stopping: (${this.movement.stopping})`, 10, 60);
            this.context.fillText(`Dashing: (${this.movement.dashing})`, 10, 80);
            this.context.fillText(`Direction: (${this.movement.direction})`, 10, 100);
        }
    }
}
