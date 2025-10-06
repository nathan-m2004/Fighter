import { randomNumber } from "../util";
import Animations from "./Animations";
import Controls from "./Controls";
import Movement from "./Movement";

export type FrameState = { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };

export type Velocity = { x: number; y: number };

export type Position = { x: number; y: number };

export type Size = { width: number; height: number };

export default class Player {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    color: string;
    position: Position;
    velocity: Velocity;
    gravity: number;
    size: Size;
    frames: FrameState;
    movement: Movement;
    debugInfo: boolean;
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
    controls: Controls;
    animation: Animations;
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

        this.debugInfo = false;

        this.controls = new Controls();
        this.animation = new Animations(this.size);
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
