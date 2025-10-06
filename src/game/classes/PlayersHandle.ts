import Fighter from "../characters/Fighter";
import { Characters } from "../characters/types";

export default class PlayerManager {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    players: Characters[];
    gravity: number;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, players: Characters[], gravity: number) {
        this.canvas = canvas;
        this.context = context;
        this.gravity = gravity;
        this.players = players;

        this.initializeEvents();
    }
    private initializeEvents() {
        window.addEventListener("gamepadconnected", (event) => {
            this.connectPlayer(event);
        });
        window.addEventListener("gamepaddisconnected", (event) => {
            this.disconnectPlayer(event);
        });
    }
    private connectPlayer(event: GamepadEvent) {
        const newPlayer = new Fighter(this.canvas, this.context, 500, 100, this.gravity);
        newPlayer.controls.gamepad.index = event.gamepad.index;
        newPlayer.animation.getPlayerImage();
        this.players.push(newPlayer);
    }
    private disconnectPlayer(event: GamepadEvent) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].controls.gamepad.index === event.gamepad.index) {
                this.players.splice(i, 1);
            }
        }
    }
}
