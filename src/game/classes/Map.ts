import Background from "./Background";
import MapObject from "./MapObject";

export default class GameMap {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    objects: MapObject[];
    background: Background;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.objects = [];
        this.background = new Background(this.canvas, this.context);
    }
    draw() {
        this.objects.forEach((object) => {
            object.draw();
        });
    }
}
