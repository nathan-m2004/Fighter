import { randomNumber } from "../util";
import Movement from "./Movement";
import axios from "axios";

export type InputState = {
    key: string;
    gamepadKey: number;
    gamepadAxe: { index: number; negative: boolean };
    pressed: boolean;
    startFramehold: number;
    timeHoldingDelta: number;
};

export type FrameState = { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };

export type Velocity = { x: number; y: number };

export type Position = { x: number; y: number };

export type Size = { width: number; height: number };

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
    size: Size;
    frames: FrameState;
    keys: Keys;
    movement: Movement;
    gamepad: { index: number };
    debugInfo: boolean;
    image: { api: string; url: string; image: HTMLImageElement };
    health: {
        points: number;
        vulnerable: boolean;
        vulnerableTimeDelta: number;
        hitVulnerabilityTimeDelta: number;
        gotHit: boolean;
        spawning: boolean;
        spawnVulnerabilityTimeDelta: number;
        timesKilled: number;
    };
    outOfBounds: number;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        this.canvas = canvas;
        this.context = context;
        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };

        this.color = `rgb(${randomNumber(70, 255)}, ${randomNumber(50, 140)}, ${randomNumber(70, 255)})`;
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 80, height: 80 };
        this.health = {
            points: 100,
            vulnerable: true,
            vulnerableTimeDelta: 0,
            hitVulnerabilityTimeDelta: 4,
            gotHit: false,
            spawning: true,
            spawnVulnerabilityTimeDelta: 15,
            timesKilled: 0,
        };

        this.outOfBounds = 2000;
        this.gravity = gravity;
        this.movement = new Movement();

        this.image = { api: "https://api.thecatapi.com/v1/images/search", url: undefined, image: undefined };

        this.debugInfo = false;

        this.gamepad = { index: undefined };
        this.keys = {
            left: {
                key: "KeyA",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            right: {
                key: "KeyD",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            up: {
                key: "KeyW",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            down: {
                key: "KeyS",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
                delayToLeavePlataform: 1.12,
            },
            dash: {
                key: "ShiftLeft",
                gamepadKey: 9,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            jump: {
                key: "Space",
                gamepadKey: 0,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            lightAttack: {
                key: "KeyJ",
                gamepadKey: 3,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
        };
        window.addEventListener("keydown", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code && this.gamepad.index === undefined) {
                    if (!action.pressed) {
                        action.timeHoldingDelta = 0;
                        action.startFramehold = 0;
                        action.pressed = true;
                    }
                }
            });
        });
        window.addEventListener("keyup", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    action.pressed = false;
                    action.timeHoldingDelta = 0;
                }
            });
        });
    }
    countTimeHoldingKey() {
        Object.values(this.keys).forEach((action) => {
            if (action.pressed) {
                action.timeHoldingDelta += this.frames.deltaTime;
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
                        button.timeHoldingDelta = 0;
                        button.startFramehold = this.frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingDelta = 0;
                }
            }

            if (button.gamepadAxe !== undefined) {
                if (
                    button.gamepadAxe.negative
                        ? gamepad.axes[button.gamepadAxe.index] <= -0.1
                        : gamepad.axes[button.gamepadAxe.index] >= 0.1
                ) {
                    if (!button.pressed) {
                        button.timeHoldingDelta = 0;
                        button.startFramehold = this.frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingDelta = 0;
                }
            }
        }
    }
    getPlayerImage() {
        axios.get(this.image.api).then((response) => {
            this.image.url = response.data[0].url;
            this.image.image = new Image(this.size.width - 10, this.size.height - 10);
            this.image.image.src = this.image.url;
        });
    }
    checkVulnerability() {
        if (this.health.gotHit) {
            this.health.vulnerableTimeDelta += this.frames.deltaTime;
            this.health.vulnerable = false;
            if (this.health.vulnerableTimeDelta >= this.health.hitVulnerabilityTimeDelta) {
                this.health.vulnerableTimeDelta = 0;
                this.health.vulnerable = true;
                this.health.gotHit = false;
            }
        }
        if (this.health.spawning) {
            this.health.vulnerableTimeDelta += this.frames.deltaTime;
            this.health.vulnerable = false;
            if (this.health.vulnerableTimeDelta >= this.health.spawnVulnerabilityTimeDelta) {
                this.health.vulnerableTimeDelta = 0;
                this.health.vulnerable = true;
                this.health.spawning = false;
            }
        }
    }
    checkIfOutOfBounds() {
        if (this.position.x >= this.outOfBounds || this.position.x <= -this.outOfBounds) {
            this.position.x = 500;
            this.position.y = 100;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.health.spawning = true;
            this.health.timesKilled += 1;
            this.health.points = 100;
        }
        if (this.position.y >= this.outOfBounds || this.position.y <= -this.outOfBounds) {
            this.position.x = 500;
            this.position.y = 100;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.health.spawning = true;
            this.health.timesKilled += 1;
            this.health.points = 100;
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
        this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        if (this.image.image) {
            this.context.drawImage(
                this.image.image,
                this.position.x + 5,
                this.position.y + 5,
                this.size.height - 10,
                this.size.width - 10
            );
        }

        if (this.movement.dashing || !this.health.vulnerable) {
            this.context.fillStyle = "rgba(0, 255, 0, 0.5)";
            this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        }

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
