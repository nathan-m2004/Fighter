import Movement from "./Movement";

export type InputState = { key: string; pressed: boolean; startFramehold: number; timeHoldingFrames: number };

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

        this.keys = {
            left: { key: "KeyA", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
            right: { key: "KeyD", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
            dash: { key: "ShiftLeft", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
            up: { key: "KeyW", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
            down: { key: "KeyS", pressed: false, startFramehold: 0, timeHoldingFrames: 0, delayToLeavePlataform: 80 },
            jump: { key: "Space", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
            lightAttack: { key: "KeyJ", pressed: false, startFramehold: 0, timeHoldingFrames: 0 },
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
