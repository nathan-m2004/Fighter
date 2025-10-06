import { Characters } from "../characters/types";

export default class Hud {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
    }
    displayHud(players: Characters[]) {
        players.forEach((player: Characters, index: number) => {
            const width = player.size.width * 0.8;
            const height = player.size.height * 0.8;
            this.context.fillStyle = player.animation.color;
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
}
