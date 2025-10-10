import Fighter from "../characters/Fighter/Fighter";
import { Characters } from "../characters/types";

export default class PlayerManager {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    players: Characters[];
    gravity: number;
    keyboardPlayer: boolean;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, players: Characters[], gravity: number) {
        this.canvas = canvas;
        this.context = context;
        this.gravity = gravity;
        this.players = players;
        this.keyboardPlayer = false;

        this.initializeEvents();
    }
    private initializeEvents() {
        window.addEventListener("keydown", (event) => {
            this.connectKeyboardPlayer(event);
        });
        window.addEventListener("gamepadconnected", (event) => {
            this.connectPlayer(event);
        });
        window.addEventListener("gamepaddisconnected", (event) => {
            this.disconnectPlayer(event);
        });
    }
    private connectKeyboardPlayer(event: KeyboardEvent) {
        if (!this.keyboardPlayer) {
            const newPlayer = new Fighter(this.canvas, this.context, 500, 100, this.gravity);
            this.players.push(newPlayer);
            this.keyboardPlayer = true;
        }
    }
    private connectPlayer(event: GamepadEvent) {
        const newPlayer = new Fighter(this.canvas, this.context, 500, 100, this.gravity);
        newPlayer.controls.gamepad.index = event.gamepad.index;
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
