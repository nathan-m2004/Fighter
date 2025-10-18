import Game from "./classes/Game";
import GameTest from "./classes/GameTest";
import map01 from "./maps/map01";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

let game: Game;

window.onload = () => {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    game = new GameTest(canvas, context, map01(canvas, context));
    window.requestAnimationFrame((currentFrame) => {
        game.frames.currentFrame = currentFrame;
        game.draw();
    });

    window.addEventListener("resize", () => {
        resizeCanvas();
    });
};
