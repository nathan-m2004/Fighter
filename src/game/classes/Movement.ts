import { FrameState, Keys, Velocity } from "./Player";

export default class Movement {
    jumpForce: number;
    jumpTimes: number;
    framePressed: number;
    jumpDelay: number;
    canMove: boolean;
    direction: any;
    speed: number;
    maxSpeed: number;
    stopping: boolean;
    stopped: boolean;
    stoppingPower: number;
    stoppingFrameStart: number;
    stoppingLengthFrames: number;
    dashing: boolean;
    dashCount: number;
    dashMax: number;
    dashForce: number;
    dashFrameStart: number;
    dashLenghtFrames: number;
    onGround: boolean;

    keys: Keys;
    frames: FrameState;
    velocity: Velocity;

    constructor() {
        this.onGround = false;
        this.jumpForce = 95;
        this.jumpTimes = 0;
        this.framePressed = 0;
        this.jumpDelay = 300;
        this.canMove = true;
        this.direction = undefined;
        this.speed = 50;
        this.maxSpeed = 80;
        this.stopping = false;
        this.stopped = true;
        this.stoppingPower = 22;
        this.stoppingFrameStart = 0;
        this.stoppingLengthFrames = 62;
        this.dashing = false;
        this.dashCount = 0;
        this.dashMax = 1;
        this.dashForce = 150;
        this.dashFrameStart = 0;
        this.dashLenghtFrames = 250;

        this.keys;
        this.frames;
        this.velocity;
    }
    update(keys: Keys, frames: FrameState, velocity: Velocity) {
        this.keys = keys;
        this.frames = frames;
        this.velocity = velocity;

        if (!this.canMove) {
            return;
        }

        // jump
        if (
            this.keys.jump.pressed === true &&
            this.jumpTimes < 2 &&
            this.frames.currentFrame - this.framePressed >= this.jumpDelay
        ) {
            this.framePressed = this.frames.currentFrame;
            this.velocity.y = 0;
            this.velocity.y = -this.jumpForce;
            this.jumpTimes++;
        }

        // dash
        if (this.keys.dash.pressed && !this.dashing && this.dashCount < this.dashMax) {
            if (!this.keys.left.pressed && !this.keys.right.pressed) {
                this.dashing = true;
                this.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.dashCount++;
            }
            if (this.keys.left.pressed) {
                this.dashing = true;
                this.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.velocity.x = -this.dashForce;
                this.dashCount++;
            }
            if (this.keys.right.pressed) {
                this.dashing = true;
                this.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.velocity.x = this.dashForce;
                this.dashCount++;
            }
        }
        if (this.frames.currentFrame - this.dashFrameStart >= this.dashLenghtFrames / 2 && this.dashing) {
            this.velocity.x = 0;
        }
        if (this.frames.currentFrame - this.dashFrameStart >= this.dashLenghtFrames && this.dashing) {
            this.dashing = false;
        }

        // side
        if (this.keys.left.pressed && !this.dashing) {
            if (this.velocity.x > 0 && !this.stopping) {
                this.stoppingFrameStart = this.frames.currentFrame;
                this.stopping = true;
                return;
            } else {
                this.velocity.x -= this.speed * this.frames.deltaTime;
                this.direction = "left";
                if (this.velocity.x <= -this.maxSpeed) {
                    this.velocity.x = -this.maxSpeed;
                }
            }
        }
        if (this.keys.right.pressed && !this.dashing) {
            if (this.velocity.x < 0 && !this.stopping) {
                this.stoppingFrameStart = this.frames.currentFrame;
                this.stopping = true;
                return;
            } else {
                this.velocity.x += this.speed * this.frames.deltaTime;
                this.direction = "right";
                if (this.velocity.x >= this.maxSpeed) {
                    this.velocity.x = this.maxSpeed;
                }
            }
        }

        // down
        if (
            this.keys.down.pressed &&
            !this.onGround &&
            this.frames.currentFrame - this.framePressed >= this.jumpDelay
        ) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
            } else {
                this.velocity.y += this.speed * this.frames.deltaTime;
            }
        }

        // side movement stopping logic
        if (this.velocity.x !== 0) {
            this.stopped = false;
        }
        if (!this.keys.left.pressed && !this.keys.right.pressed && !this.stopping && !this.stopped) {
            this.stopping = true;
            this.stoppingFrameStart = this.frames.currentFrame;
        }
        if (this.stopping) {
            this.velocity.x /= this.stoppingPower * this.frames.deltaTime;
        }
        if (this.stoppingLengthFrames <= this.frames.currentFrame - this.stoppingFrameStart && this.stopping) {
            this.stopping = false;
            this.stopped = true;
            this.velocity.x = 0;
        }
    }
}
