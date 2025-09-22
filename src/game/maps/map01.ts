import GameMap from "../classes/Map";
import MapObject from "../classes/MapObject";

export default (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const map = new GameMap(canvas, context);
    map.objects.push(new MapObject(canvas, context, 300, 700, 500, 50));
    const sideBlock = new MapObject(canvas, context, 600, 500, 200, 50);
    sideBlock.canGoInside = true;
    map.objects.push(sideBlock);
    return map;
};
