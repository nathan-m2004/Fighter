import { rectangleRectangle } from "../collisions";
import Background from "./Background";
import GameMap from "./Map";
import Player from "./Player";

export default class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frames: { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };
    map: GameMap;
    player: Player;
    gravity: number;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.map = map;

        this.gravity = 15;
        this.player = new Player(this.canvas, this.context, 500, 100, this.gravity);
    }
    collisionPlayerObject() {
        for (let i = 0; i < this.map.objects.length; i++) {
            const object = this.map.objects[i];
            const collision = rectangleRectangle(this.player, object);
            if (collision === "top") {
                this.player.position.y = object.position.y - this.player.size.height;
                if (!this.player.onGround) {
                    this.player.velocity.y = 0;
                    this.player.jump.jumpTimes = 0;
                    this.player.playerMovement.dashCount = 0;
                }
                this.player.onGround = true;
            } else {
                this.player.onGround = false;
            }
            if (collision === "bottom") {
                this.player.position.y = object.position.y + object.size.height;
                this.player.velocity.y = 0;
            }
            if (collision === "left") {
                this.player.position.x = object.position.x - this.player.size.width;
                this.player.velocity.x = 0;
            }
            if (collision === "right") {
                this.player.position.x = object.position.x + object.size.width;
                this.player.velocity.x = 0;
            }

            this.context.fillStyle = "black"; // Set a color for the text
            this.context.font = "16px Arial"; // Set the font and size
            const text = `${collision}`;
            // Position the text within the rectangle
            this.context.fillText(text, object.position.x + 10, object.position.y + 20);
        }
    }
    draw() {
        this.frames.deltaTime = (this.frames.currentFrame - this.frames.lastFrame) / 100;
        this.frames.lastFrame = this.frames.currentFrame;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw();

        this.player.frames = this.frames;
        this.collisionPlayerObject();
        this.player.handleMovement();
        this.player.physics();
        this.player.draw();

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
