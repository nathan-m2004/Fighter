import { Characters } from "../characters/types";
import { Position, Size } from "./Player";

export default class Camera {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    position: Position;
    target: Characters;
    size: Size;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.position = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.target;
        this.size = { width: this.canvas.width, height: this.canvas.height };
    }
    follow(player: Characters) {
        this.target = player;
    }
    update() {
        if (!this.target) return;

        let targetX = this.target.position.x + this.target.size.width / 2 - this.size.width / 2;
        let targetY = this.target.position.y + this.target.size.height / 2 - this.size.height / 2;

        if (targetX < 0) {
            targetX = 0;
        }
        if (targetX + this.size.width > this.size.width) {
            targetX = this.size.width;
        }

        // Clamp vertical movement
        if (targetY < 0) {
            targetY = 0;
        }
        if (targetY + this.size.height > this.size.height) {
            targetY = this.size.height;
        }

        this.position.x = targetX;
        this.position.y = targetY;
    }
    apply() {
        this.context.save();
        this.context.translate(-this.position.x, -this.position.y);
    }
    unapply() {
        this.context.restore();
    }
}
