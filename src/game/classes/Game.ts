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
    attackConfig: { KNOCKBACK_FORCE_DIVISOR: number; DAMAGE_OVERLAP_FACTOR: number; MINIMUM_HEALTH: number };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        this.canvas = canvas;
        this.context = context;

        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };
        this.map = map;
        this.attackConfig = { KNOCKBACK_FORCE_DIVISOR: 2000, DAMAGE_OVERLAP_FACTOR: 100, MINIMUM_HEALTH: 1 };

        this.gravity = 15;
        this.players = [new Fighter(this.canvas, this.context, 500, 300, this.gravity)];
        let dummy = new Fighter(this.canvas, this.context, 500, 0, this.gravity);
        dummy.dummy = true;
        dummy.health.spawning = false;
        this.players.push(dummy);

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
    collisionAttackPlayer() {
        for (let a = 0; a < this.players.length; a++) {
            const playerA = this.players[a];
            const attackPosition = playerA.attack.currentsPositionSize;
            const attackState = playerA.attack.current;

            if (!attackPosition && !attackState) {
                continue;
            }

            for (let b = 0; b < this.players.length; b++) {
                if (a === b) {
                    continue;
                }

                const playerB = this.players[b];
                const collision = rectangleRectangle(attackPosition, playerB);

                if (collision && playerB.health.vulnerable) {
                    playerB.movement.knockedBack = true;
                    const overlapSum = collision.overlapX + collision.overlapY;
                    const hitValue = (overlapSum * playerB.health.points) / this.attackConfig.KNOCKBACK_FORCE_DIVISOR;

                    playerB.health.gotHit = true;
                    playerB.health.points -= Math.floor(
                        attackState.hitPoints +
                            (attackState.hitPoints * overlapSum) / this.attackConfig.DAMAGE_OVERLAP_FACTOR
                    );
                    if (playerB.health.points <= 0) {
                        playerB.health.points = this.attackConfig.MINIMUM_HEALTH;
                    }

                    if (attackState.directional.vertical === "up") {
                        playerB.velocity.y -= attackState.knockBack.force / hitValue;
                    }
                    if (attackState.directional.vertical === "down") {
                        playerB.velocity.y += attackState.knockBack.force / hitValue;
                    }
                    if (attackState.directional.horizontal === "left") {
                        playerB.velocity.x -= attackState.knockBack.force / hitValue;
                    }
                    if (attackState.directional.horizontal === "right") {
                        playerB.velocity.x += attackState.knockBack.force / hitValue;
                    }
                }
            }
        }
    }
    collisionPlayerObject() {
        this.players.forEach((player) => {
            player.movement.onGround = false;

            for (let i = 0; i < this.map.objects.length; i++) {
                const object = this.map.objects[i];
                const collision = rectangleRectangle(player, object);

                if (collision) {
                    if (collision.side === "top" && !object.canGoInside) {
                        player.velocity.y = 0;
                        player.position.y = object.position.y - player.size.height;
                        player.movement.jumpTimes = 0;
                        player.movement.dashCount = 0;
                        player.movement.onGround = true;
                    }
                    if (collision.side === "bottom" && !object.canGoInside) {
                        player.position.y = object.position.y + object.size.height;
                        player.velocity.y = 0;
                    }
                    if (collision.side === "left" && !object.canGoInside) {
                        player.position.x = object.position.x - player.size.width;
                        player.velocity.x = 0;
                    }
                    if (collision.side === "right" && !object.canGoInside) {
                        player.position.x = object.position.x + object.size.width;
                        player.velocity.x = 0;
                    }

                    if (
                        collision.side === "top" &&
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
        this.collisionAttackPlayer();
        this.players.forEach((player) => {
            player.frames = this.frames;
            if (player.dummy) {
                player.movement.update(player.keys, player.frames, player.velocity, true);
            } else {
                player.movement.update(player.keys, player.frames, player.velocity, false);
                player.gamepadUpdate();
                player.handleAttacks();
                player.countTimeHoldingKey();
            }
            player.checkVulnerability();
            player.checkIfOutOfBounds();
            player.physics();
            player.draw();
        });

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
