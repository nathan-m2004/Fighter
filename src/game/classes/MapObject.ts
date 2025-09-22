export default class MapObject {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    position: { x: number; y: number };
    size: { width: number; height: number };
    color: string;
    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.canvas = canvas;
        this.context = context;

        this.color = "white";
        this.position = { x: x, y: y };
        this.size = { width: width, height: height };
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
