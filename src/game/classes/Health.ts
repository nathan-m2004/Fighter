import { FrameState, Position, Velocity } from "./Player";

export default class Health {
    frames: FrameState;
    position: Position;
    velocity: Velocity;
    outOfBounds: number;
    points: number;
    vulnerable: boolean;
    vulnerableTimeDelta: number;
    hitVulnerabilityTimeDelta: number;
    gotHit: boolean;
    spawning: boolean;
    spawnVulnerabilityTimeDelta: number;
    timesKilled: number;
    constructor() {
        this.frames;
        this.position;
        this.velocity;

        this.points = 100;
        this.vulnerable = true;
        this.vulnerableTimeDelta = 0;
        this.hitVulnerabilityTimeDelta = 4;
        this.gotHit = false;
        this.spawning = true;
        this.spawnVulnerabilityTimeDelta = 15;
        this.timesKilled = 0;
        this.outOfBounds = 2000;
    }
    checkVulnerability(frames: FrameState) {
        this.frames = frames;
        if (this.gotHit) {
            this.vulnerableTimeDelta += this.frames.deltaTime;
            this.vulnerable = false;
            if (this.vulnerableTimeDelta >= this.hitVulnerabilityTimeDelta) {
                this.vulnerableTimeDelta = 0;
                this.vulnerable = true;
                this.gotHit = false;
            }
        }
        if (this.spawning) {
            this.vulnerableTimeDelta += this.frames.deltaTime;
            this.vulnerable = false;
            if (this.vulnerableTimeDelta >= this.spawnVulnerabilityTimeDelta) {
                this.vulnerableTimeDelta = 0;
                this.vulnerable = true;
                this.spawning = false;
            }
        }
    }
    checkIfOutOfBounds(position: Position, velocity: Velocity) {
        this.position = position;
        this.velocity = velocity;
        if (this.position.x >= this.outOfBounds || this.position.x <= -this.outOfBounds) {
            this.position.x = 500;
            this.position.y = 100;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.spawning = true;
            this.timesKilled += 1;
            this.points = 100;
        }
        if (this.position.y >= this.outOfBounds || this.position.y <= -this.outOfBounds) {
            this.position.x = 500;
            this.position.y = 100;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.spawning = true;
            this.timesKilled += 1;
            this.points = 100;
        }
    }
}
