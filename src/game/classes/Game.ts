import Fighter from "../characters/Fighter";
import { Characters } from "../characters/types";
import Collisions from "./Collisions";
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
    collisions: Collisions;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.map = map;
        this.collisions = new Collisions();

        this.gravity = 15;
        this.players = [new Fighter(this.canvas, this.context, 500, 300, this.gravity)];
        let dummy = new Fighter(this.canvas, this.context, 500, 0, this.gravity);
        dummy.movement.dummy = true;
        dummy.health.spawning = false;
        this.players.push(dummy);

        window.addEventListener("gamepadconnected", (event) => {
            const newPlayer = new Fighter(this.canvas, this.context, 500, 100, this.gravity);
            newPlayer.controls.gamepad.index = event.gamepad.index;
            newPlayer.animation.getPlayerImage();
            this.players.push(newPlayer);
        });
        window.addEventListener("gamepaddisconnected", (event) => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].controls.gamepad.index === event.gamepad.index) {
                    this.players.splice(i, 1);
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

            this.context.fillStyle = "white";
            this.context.font = "16px Arial";
            this.context.fillText(`Morreu: (${player.health.timesKilled})`, 90, height * index + 10 * index + 40);

            this.context.fillText(`Vida: (${player.health.points})`, 90, height * index + 10 * index + 60);

            if (player.animation.image) {
                this.context.drawImage(
                    player.animation.image,
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
        this.players.forEach((player) => {
            player.frames = this.frames;
            this.collisions.collisionPlayerObject(player, this.map.objects);
            if (player.movement.dummy) {
                player.movement.update(player.controls.keys, player.frames, player.velocity);
            } else {
                player.movement.update(player.controls.keys, player.frames, player.velocity);
                player.controls.gamepadUpdate(this.frames);
                player.handleAttacks();
                player.controls.countTimeHoldingKey(this.frames);
            }
            player.checkVulnerability();
            player.checkIfOutOfBounds();
            this.players.forEach((playerB) => {
                this.collisions.collisionAttackPlayer(player, playerB);
            });
            player.physics();
            player.draw();
        });

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
