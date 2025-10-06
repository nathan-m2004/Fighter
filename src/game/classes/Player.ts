import Animations from "./Animations";
import Controls from "./Controls";
import Health from "./Health";
import Movement from "./Movement";

export type FrameState = { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };

export type Velocity = { x: number; y: number };

export type Position = { x: number; y: number };

export type Size = { width: number; height: number };

export default class Player {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    position: Position;
    velocity: Velocity;
    gravity: number;
    size: Size;
    frames: FrameState;
    movement: Movement;
    debugInfo: boolean;
    outOfBounds: number;
    controls: Controls;
    animation: Animations;
    health: Health;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 80, height: 80 };
        this.gravity = gravity;

        this.debugInfo = false;

        this.controls = new Controls();
        this.movement = new Movement();
        this.animation = new Animations(this.size);
        this.health = new Health();
    }
    physics() {
        if (!this.movement.dashing) {
            this.velocity.y += this.gravity * this.frames.deltaTime;
        }

        this.position.x += this.velocity.x * this.frames.deltaTime;
        this.position.y += this.velocity.y * this.frames.deltaTime;
    }
    draw() {
        this.context.fillStyle = this.animation.color;
        this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        if (this.animation.image) {
            this.context.drawImage(
                this.animation.image,
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
                260,
                20
            );
            this.context.fillText(`Velocity: (${this.velocity.x.toFixed(1)}, ${this.velocity.y.toFixed(1)})`, 260, 40);
            this.context.fillText(`Stopping: (${this.movement.stopping})`, 260, 60);
            this.context.fillText(`Dashing: (${this.movement.dashing})`, 260, 80);
            this.context.fillText(`Direction: (${this.movement.direction})`, 260, 100);
            this.context.fillText(`Accelerating: (${this.movement.accelerating})`, 260, 120);
            this.context.fillText(`FullSpeed: (${this.movement.fullSpeed})`, 260, 140);
        }
    }
}
