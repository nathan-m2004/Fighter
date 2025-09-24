import Fighter from "../characters/Fighter";
import { Characters } from "../characters/types";
import { rectangleRectangle } from "../collisions";
import GameMap from "./Map";
import Player from "./Player";

export default class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frames: { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };
    map: GameMap;
    players: Characters[];
    gravity: number;
    dummy: Player;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.map = map;

        this.gravity = 15;
        this.players = [new Fighter(this.canvas, this.context, 500, 100, this.gravity)];
        let dummy = new Fighter(this.canvas, this.context, 500, 200, this.gravity);
        dummy.dummy = true;
        this.players.push(dummy);
    }
    collisionPlayerObject() {
        this.players.forEach((player) => {
            player.onGround = false;

            for (let i = 0; i < this.map.objects.length; i++) {
                const object = this.map.objects[i];
                const collision = rectangleRectangle(player, object);

                if (collision === "top" && !object.canGoInside) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.jump.jumpTimes = 0;
                    player.playerMovement.dashCount = 0;
                    player.onGround = true;
                }
                if (collision === "bottom" && !object.canGoInside) {
                    player.position.y = object.position.y + object.size.height;
                    player.velocity.y = 0;
                }
                if (collision === "left" && !object.canGoInside) {
                    player.position.x = object.position.x - player.size.width;
                    player.velocity.x = 0;
                }
                if (collision === "right" && !object.canGoInside) {
                    player.position.x = object.position.x + object.size.width;
                    player.velocity.x = 0;
                }

                if (
                    collision === "top" &&
                    object.canGoInside &&
                    player.velocity.y >= 0 &&
                    player.keys.down.timeHoldingFrames <= player.keys.down.delayToLeavePlataform
                ) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.jump.jumpTimes = 0;
                    player.playerMovement.dashCount = 0;
                    player.onGround = true;
                }

                this.context.fillStyle = "black"; // Set a color for the text
                this.context.font = "16px Arial"; // Set the font and size
                const text = `${collision}`;
                // Position the text within the rectangle
                this.context.fillText(text, object.position.x + 10, object.position.y + 20);
            }
        });
    }
    draw() {
        this.frames.deltaTime = (this.frames.currentFrame - this.frames.lastFrame) / 100;
        this.frames.lastFrame = this.frames.currentFrame;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw();

        this.collisionPlayerObject();
        this.players.forEach((player) => {
            if (player.dummy) {
                player.frames = this.frames;
                player.physics();
                player.draw();
                return;
            }
            player.frames = this.frames;
            player.handleMovement();
            player.handleAttacks();
            player.physics();
            player.draw();
        });

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
