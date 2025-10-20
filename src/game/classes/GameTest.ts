import { Characters } from "../characters/types";
import Game from "./Game";
import GameMap from "./Map";
import Menu from "./Menu";
import testMenu from "./../menus/testMenu.html?raw";
import Fighter from "../characters/Fighter/Fighter";

type ClickedCoord = { screenX: number; screenY: number; worldX: number; worldY: number };

export default class GameTest extends Game {
    menu: Menu;
    addPlayer: boolean;
    selectControl: boolean;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: GameMap) {
        super(canvas, context, map);

        this.menu = new Menu(testMenu);
        this.menu.injectHtml();

        const buttonMaps = {
            addPlayer: { id: "add-player-btn", bool: false },
            selectControl: { id: "change-player-btn", bool: false },
        };

        this.menu.button = buttonMaps;
        this.menu.buttonHandle();

        window.addEventListener("click", (event) => {
            // 1. Get click coordinates relative to the canvas (Screen Space)
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const screenX = (event.clientX - rect.left) * scaleX;
            const screenY = (event.clientY - rect.top) * scaleY;

            // 2. Convert to World Space
            const worldX = screenX + this.camera.position.x;
            const worldY = screenY + this.camera.position.y;

            // 3. Create a coordinates object to pass to your functions
            const clickCoords = {
                screenX: screenX,
                screenY: screenY,
                worldX: worldX,
                worldY: worldY,
            };

            this.playerSelect(event, clickCoords);
            this.addPlayerEvent(event, clickCoords);
            this.selectControlEvent(event, clickCoords);
        });
    }

    isClickedPlayer(event: MouseEvent, clickCoords: ClickedCoord, player: Characters, index: number): boolean {
        const width = player.size.width * 0.8;
        const height = player.size.height * 0.8;
        const yPosition = height * index + 10 * index + 10;
        const hudCheck =
            10 <= event.x && yPosition <= event.y && width + 10 >= event.x && yPosition + height >= event.y;
        const playerPositionCheck =
            player.position.x <= clickCoords.worldX &&
            player.position.y <= clickCoords.worldY &&
            player.position.x + player.size.width >= clickCoords.worldX &&
            player.position.y + player.size.height >= clickCoords.worldY;
        return hudCheck || playerPositionCheck;
    }

    addPlayerEvent(event: MouseEvent, clickCoords: ClickedCoord) {
        if (!this.menu.button.addPlayer.bool) return;
        const player = new Fighter(this.canvas, this.context, clickCoords.worldX, clickCoords.worldY, this.gravity);
        player.movement.dummy = true;
        this.players.push(player);
    }

    selectControlEvent(event: MouseEvent, clickCoords: ClickedCoord) {
        if (!this.menu.button.selectControl.bool) return;
        let selected: Characters = undefined;
        this.players.forEach((player: Characters, index: number) => {
            if (this.isClickedPlayer(event, clickCoords, player, index)) {
                player.movement.dummy ? (player.movement.dummy = false) : (player.movement.dummy = true);
                selected = player;
            }
        });

        this.players.forEach((player) => {
            if (player !== selected && selected !== undefined) {
                player.movement.dummy = true;
            }
        });
    }

    playerSelect(event: MouseEvent, clickCoords: ClickedCoord) {
        let selected: Characters = undefined;
        this.players.forEach((player: Characters, index: number) => {
            if (this.isClickedPlayer(event, clickCoords, player, index)) {
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
