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
        this.players = [
            new Fighter(this.canvas, this.context, 500, 100, this.gravity),
            //new Fighter(this.canvas, this.context, 300, 100, this.gravity),
            //new Fighter(this.canvas, this.context, 600, 100, this.gravity),
        ];
        //let dummy = new Fighter(this.canvas, this.context, 500, 200, this.gravity);
        //dummy.dummy = true;
        //this.players.push(dummy);

        window.addEventListener("gamepadconnected", (event) => {
            const newPlayer = new Fighter(this.canvas, this.context, 500, 100, this.gravity);
            newPlayer.gamepad.index = event.gamepad.index;
            newPlayer.getPlayerImage();
            this.players.push(newPlayer);
        });
        window.addEventListener("gamepaddisconnected", (event) => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].gamepad.index === event.gamepad.index) {
                    this.players.splice(i, 1);
                }
            }
        });
    }
    collisionPlayerObject() {
        this.players.forEach((player) => {
            player.movement.onGround = false;

            for (let i = 0; i < this.map.objects.length; i++) {
                const object = this.map.objects[i];
                const collision = rectangleRectangle(player, object);

                if (collision === "top" && !object.canGoInside) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.movement.jumpTimes = 0;
                    player.movement.dashCount = 0;
                    player.movement.onGround = true;
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
                    player.keys.down.timeHoldingDelta <= player.keys.down.delayToLeavePlataform
                ) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.movement.jumpTimes = 0;
                    player.movement.dashCount = 0;
                    player.movement.onGround = true;
                }
            }
        });
    }
    displayHud() {
        this.players.forEach((player, index) => {
            const width = player.size.width * 0.8;
            const height = player.size.height * 0.8;
            this.context.fillStyle = player.color;
            this.context.fillRect(10, height * index + 10 * index + 10, width, height);

            if (player.image.image) {
                this.context.drawImage(
                    player.image.image,
                    10 + 4,
                    height * index + 10 * index + 10 + 4,
                    width - 8,
                    height - 8
                );
            }
        });
    }
    draw() {
        this.frames.deltaTime = (this.frames.currentFrame - this.frames.lastFrame) / 100;
        this.frames.lastFrame = this.frames.currentFrame;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw();

        this.displayHud();
        this.collisionPlayerObject();
        this.players.forEach((player) => {
            if (player.dummy) {
                player.frames = this.frames;
                player.physics();
                player.draw();
                return;
            }
            player.frames = this.frames;
            player.movement.update(player.keys, player.frames, player.velocity);
            player.gamepadUpdate();
            player.countTimeHoldingKey();
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
