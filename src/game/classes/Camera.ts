import { Characters } from "../characters/types";
import { Position, Size } from "./Player";

export default class Camera {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    position: Position;
    target: Characters | { position: Position; size: Size };
    size: Size;
    players: Characters[];
    scale: number;
    maxPosition: Position;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, players: Characters[]) {
        this.canvas = canvas;
        this.context = context;
        this.players = players;

        this.scale = 1;
        this.position = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.maxPosition = { x: 560, y: 100 };
        this.size = { width: this.canvas.width, height: this.canvas.height };
        this.target = { position: { x: undefined, y: undefined }, size: { height: undefined, width: undefined } };
    }
    follow(player: Characters) {
        this.target = player;
    }
    followAll() {
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < this.players.length; i++) {
            sumX += this.players[i].position.x;
            sumY += this.players[i].position.y;
        }

        const centerX = sumX / this.players.length;
        const centerY = sumY / this.players.length;

        this.target.position.x = centerX;
        this.target.position.y = centerY;
    }
    update() {
        let targetX;
        let targetY;

        if (this.target) {
            targetX = this.target.position.x - this.size.width / 2;
            targetY = this.target.position.y - this.size.height / 2;
        }

        if (targetX < 0) {
            targetX = 0;
        }
        if (targetX > this.maxPosition.x) {
            targetX = this.maxPosition.x;
        }

        // Clamp vertical movement
        if (targetY < 0) {
            targetY = 0;
        }
        if (targetY > this.maxPosition.y) {
            targetY = this.maxPosition.y;
        }

        this.position.x = targetX;
        this.position.y = targetY;
    }
    apply() {
        this.context.save();
        this.context.scale(this.scale, this.scale);
        this.context.translate(-this.position.x, -this.position.y);
    }
    unapply() {
        this.context.restore();
    }
}
