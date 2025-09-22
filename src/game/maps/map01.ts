import GameMap from "../classes/Map";
import MapObject from "../classes/MapObject";

export default (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const map = new GameMap(canvas, context);
    map.objects.push(new MapObject(canvas, context, 300, 700, 500, 50));
    return map;
};
