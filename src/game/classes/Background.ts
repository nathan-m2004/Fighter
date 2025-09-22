export default class Background {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    color: string;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.color = "black";
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
