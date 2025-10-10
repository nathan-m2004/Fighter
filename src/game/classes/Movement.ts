import { Keys } from "./Controls";
import { FrameState, Velocity } from "./Player";

// THIS CLASS IS DOGSHIT

export default class Movement {
    jumpForce: number;
    jumpTimes: number;
    jumpTimeDelta: number;
    jumpDelay: number;
    canMove: boolean;
    direction: any;
    speed: number;
    maxSpeed: number;
    stopping: boolean;
    stopped: boolean;
    stoppingPower: number;
    stoppingTimeDelta: number;
    stoppingLengthDelta: number;
    dashing: boolean;
    dashCount: number;
    dashMax: number;
    dashForce: number;
    dashTimeDelta: number;
    dashLenghtDelta: number;
    dashTimeToStopMovement: number;
    onGround: boolean;

    keys: Keys;
    frames: FrameState;
    velocity: Velocity;
    knockedBack: boolean;
    knockedBackTimeDelta: number;
    knockedBackLengthTime: number;
    dummy: boolean;
    accelerating: boolean;
    acceleratingLengthDelta: number;
    acceleratingTimeDelta: number;
    fullSpeed: boolean;
    accelerationSpeed: number;
    downSpeed: number;

    constructor() {
        this.onGround = false;
        this.downSpeed = 100;

        this.jumpForce = 95;
        this.jumpTimes = 0;
        this.jumpTimeDelta = 0;
        this.jumpDelay = 5;

        this.canMove = true;
        this.direction = "right";

        this.fullSpeed = false;
        this.speed = 1500;
        this.maxSpeed = 1500;
        this.accelerating = false;
        this.accelerationSpeed = 600;
        this.acceleratingLengthDelta = 1.2;
        this.acceleratingTimeDelta = 0;

        this.stopping = false;
        this.stopped = true;
        this.stoppingPower = 25;
        this.stoppingTimeDelta = 0;
        this.stoppingLengthDelta = 1.2;

        this.dashing = false;
        this.dashCount = 0;
        this.dashMax = 1;
        this.dashForce = 150;
        this.dashTimeDelta = 0;
        this.dashLenghtDelta = 2.5;
        this.dashTimeToStopMovement = 1.5;

        this.knockedBack = false;
        this.knockedBackLengthTime = 2;
        this.knockedBackTimeDelta = 0;

        this.keys;
        this.frames;
        this.velocity;
        this.dummy = false;
    }
    update(keys: Keys, frames: FrameState, velocity: Velocity) {
        this.keys = keys;
        this.frames = frames;
        this.velocity = velocity;

        this.jumpTimeDelta += this.frames.deltaTime;
        this.stoppingTimeDelta += this.frames.deltaTime;
        this.acceleratingTimeDelta += this.frames.deltaTime;
        this.dashTimeDelta += this.frames.deltaTime;

        // knockedBack
        if (this.knockedBackTimeDelta >= this.knockedBackLengthTime) {
            this.knockedBack = false;
            this.knockedBackTimeDelta = 0;
        }

        if (this.knockedBack) {
            this.knockedBackTimeDelta += this.frames.deltaTime;
            return;
        }

        // side movement stopping logic
        if (this.velocity.x !== 0) {
            this.stopped = false;
        }
        if (!this.keys.left.pressed && !this.keys.right.pressed && !this.stopping && !this.stopped) {
            this.stopping = true;
            this.accelerating = false;
            this.fullSpeed = false;
            this.stoppingTimeDelta = 0;
        }
        if (this.stopping) {
            if (this.velocity.x > 0) {
                this.velocity.x -= this.stoppingPower * this.frames.deltaTime;
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;
                }
            }
            if (this.velocity.x < 0) {
                this.velocity.x += this.stoppingPower * this.frames.deltaTime;
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;
                }
            }
        }
        if (this.stoppingLengthDelta <= this.stoppingTimeDelta && this.stopping) {
            this.stopping = false;
            this.stopped = true;
            this.velocity.x = 0;
        }

        if (!this.canMove || this.dummy) {
            return;
        }

        // jump
        if (this.keys.jump.pressed === true && this.jumpTimes < 2 && this.jumpTimeDelta >= this.jumpDelay) {
            this.jumpTimeDelta = 0;
            this.velocity.y = 0;
            this.velocity.y = -this.jumpForce;
            this.jumpTimes++;
        }

        // dash
        if (this.keys.dash.pressed && !this.dashing && this.dashCount < this.dashMax) {
            if (!this.keys.left.pressed && !this.keys.right.pressed) {
                this.dashing = true;
                this.dashTimeDelta = 0;

                this.velocity.y = 0;
                this.dashCount++;
            }
            if (this.keys.left.pressed) {
                this.dashing = true;
                this.dashTimeDelta = 0;

                this.velocity.y = 0;
                this.velocity.x = -this.dashForce;
                this.dashCount++;
            }
            if (this.keys.right.pressed) {
                this.dashing = true;
                this.dashTimeDelta = 0;

                this.velocity.y = 0;
                this.velocity.x = this.dashForce;
                this.dashCount++;
            }
        }
        if (this.dashTimeDelta >= this.dashTimeToStopMovement && this.dashing) {
            this.velocity.x = 0;
        }
        if (this.dashTimeDelta >= this.dashLenghtDelta && this.dashing) {
            this.dashing = false;
        }

        // side
        if (this.keys.left.pressed && !this.dashing) {
            if (this.velocity.x > 0 && !this.stopping) {
                this.stoppingTimeDelta = 0;
                this.stopping = true;
                this.accelerating = false;
                this.fullSpeed = false;
                return;
            } else if (!this.accelerating && !this.fullSpeed) {
                if (this.onGround) {
                    this.acceleratingTimeDelta = 0;
                    this.accelerating = true;
                } else {
                    this.fullSpeed = true;
                }
                this.direction = "left";
            }
        }
        if (this.keys.right.pressed && !this.dashing) {
            if (this.velocity.x < 0 && !this.stopping) {
                this.stoppingTimeDelta = 0;
                this.stopping = true;
                this.accelerating = false;
                this.fullSpeed = false;
                return;
            } else if (!this.accelerating && !this.fullSpeed) {
                if (this.onGround) {
                    this.acceleratingTimeDelta = 0;
                    this.accelerating = true;
                } else {
                    this.fullSpeed = true;
                }
                this.direction = "right";
            }
        }

        if (this.accelerating && !this.dashing) {
            switch (this.direction) {
                case "left":
                    this.velocity.x = -this.accelerationSpeed * this.frames.deltaTime;
                    break;
                case "right":
                    this.velocity.x = this.accelerationSpeed * this.frames.deltaTime;
                    break;
            }
        }
        if (this.acceleratingLengthDelta <= this.acceleratingTimeDelta && this.accelerating) {
            this.fullSpeed = true;
            this.accelerating = false;
        }
        if (this.fullSpeed && !this.dashing) {
            switch (this.direction) {
                case "left":
                    this.velocity.x = -this.speed * this.frames.deltaTime;
                    break;
                case "right":
                    this.velocity.x = this.speed * this.frames.deltaTime;
                    break;
            }
        }

        if (this.keys.down.pressed && !this.onGround && this.jumpTimeDelta >= this.jumpDelay) {
            // down
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
            } else {
                this.velocity.y += this.downSpeed * this.frames.deltaTime;
                if (velocity.y >= this.maxSpeed) {
                    velocity.y = this.maxSpeed;
                }
            }
        }
    }

    get booleans(): { [key: string]: boolean } {
        const booleanEntries = Object.entries(this).filter(([key, value]) => {
            return typeof value === "boolean";
        });

        return Object.fromEntries(booleanEntries);
    }
}
