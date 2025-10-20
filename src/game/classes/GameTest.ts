import { Characters } from "../characters/types";
import Game from "./Game";
import GameMap from "./Map";
import Menu from "./Menu";
import testMenu from "./../menus/testMenu.html?raw";
import Fighter from "../characters/Fighter/Fighter";

export default class GameTest extends Game {
    menu: Menu;
    addPlayer: boolean;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        super(canvas, context, map);

        this.menu = new Menu(testMenu);
        this.menu.injectHtml();

        this.addPlayer = false;

        window.addEventListener("click", (event) => {
            this.playerSelect(event);
            this.addPlayerEvent(event);
        });
        document.getElementById("add-player-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            this.addPlayer ? (this.addPlayer = false) : (this.addPlayer = true);
        });
    }

    addPlayerEvent(event: MouseEvent) {
        if (!this.addPlayer) return;
        const player = new Fighter(this.canvas, this.context, event.x, event.y, this.gravity);
        player.movement.dummy = true;
        this.players.push(player);
    }

    playerSelect(event: MouseEvent) {
        let selected: Characters = undefined;
        this.players.forEach((player: Characters, index: number) => {
            const width = player.size.width * 0.8;
            const height = player.size.height * 0.8;
            const yPosition = height * index + 10 * index + 10;
            if (10 <= event.x && yPosition <= event.y && width + 10 >= event.x && yPosition + height >= event.y) {
                player.debugInfo ? (player.debugInfo = false) : (player.debugInfo = true);
                selected = player;
            }
        });

        this.players.forEach((player) => {
            if (player !== selected && selected !== undefined) {
                player.debugInfo = false;
            }
        });
    }

    draw() {
        this.frames.deltaTime = (this.frames.currentFrame - this.frames.lastFrame) / 100;
        this.frames.lastFrame = this.frames.currentFrame;

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
        });

        this.camera.followAll();
        this.camera.update();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.background.draw();
        this.players.forEach((player) => {
            player.drawDebugInfo();
        });
        this.camera.apply();

        this.map.draw();
        this.players.forEach((player) => {
            player.draw();
            player.drawHitbox();
            player.animation.drawLoop();
        });

        this.camera.unapply();

        this.hud.displayHud(this.players);

        this.frames.animationFrame = window.requestAnimationFrame((currentFrame) => {
            this.frames.currentFrame = currentFrame;
            this.draw();
        });
    }
}
