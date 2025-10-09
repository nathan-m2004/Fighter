import { Characters } from "../characters/types";
import Collisions from "./Collisions";
import Hud from "./Hud";
import GameMap from "./Map";
import Player from "./Player";
import PlayerManager from "./PlayersHandle";

export default class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    frames: { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };
    map: GameMap;
    players: Characters[];
    gravity: number;
    dummy: Player;
    collisions: Collisions;
    hud: Hud;
    playerManager: PlayerManager;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.map = map;

        this.collisions = new Collisions();
        this.hud = new Hud(this.canvas, this.context);

        this.gravity = 15;
        this.players = [];
        this.playerManager = new PlayerManager(this.canvas, this.context, this.players, this.gravity);
    }
    draw() {
        this.frames.deltaTime = (this.frames.currentFrame - this.frames.lastFrame) / 100;
        this.frames.lastFrame = this.frames.currentFrame;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw();

        this.hud.displayHud(this.players);
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
            player.health.checkVulnerability(player.frames);
            player.health.checkIfOutOfBounds(player.position, player.velocity);
            this.players.forEach((playerB) => {
                this.collisions.collisionAttackPlayer(player, playerB);
            });
            player.physics();
            player.draw();
            player.animation.checkCurrent(player.movement, player.attack.current_key);
            player.animation.drawLoop(player.movement.direction);
        });

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
