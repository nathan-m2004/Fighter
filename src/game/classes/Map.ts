import Background from "./Background";
import MapObject from "./MapObject";
import { Position } from "./Player";

export default class GameMap {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    objects: MapObject[];
    background: Background;
    camera: { maxPosition: Position };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.objects = [];
        this.background = new Background(this.canvas, this.context);
        this.camera = { maxPosition: { x: undefined, y: undefined } };
    }
    draw() {
        this.objects.forEach((object) => {
            object.draw();
        });
    }
}
