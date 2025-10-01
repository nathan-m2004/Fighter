import BaseAttacks from "./BaseAttacks";

export default class Fighter extends BaseAttacks {
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);
    }
}
