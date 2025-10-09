import axios from "axios";
import { FrameState, Position, Size } from "./Player";
import { randomNumber } from "../util";

class Animation {
    frame_length: number;
    frame_width: number;
    frame_count: number;
    sprite_sheet_url: string;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    sprite: HTMLImageElement;
    frame_height: number;
    animation_length: number;
    animation_frame_map: number[];
    isLoop: boolean;
    frames: FrameState;
    deltaTimer: number;
    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        frames: FrameState,
        sprite_sheet_url: string,
        frame_length: number,
        frame_width: number,
        frame_height: number,
        animation_length: number
    ) {
        this.canvas = canvas;
        this.context = context;
        this.frames = frames;
        this.deltaTimer = 0;
        this.animation_length = animation_length;
        this.frame_length = frame_length;
        this.frame_count = 0;
        this.frame_height = frame_height;
        this.frame_width = frame_width;
        this.sprite_sheet_url = sprite_sheet_url;
        this.sprite = new Image();
        this.sprite.src = this.sprite_sheet_url;

        this.animation_frame_map = [0.12, 0.3, 0.45, 0.6, 0.8, 1];
        this.isLoop = true;
    }
    frameLoop(frames: FrameState) {
        this.frames = frames;
        this.deltaTimer += this.frames.deltaTime;
        if (this.frame_count > this.frame_length) {
            this.frame_count = 0;
        }
        if (this.isLoop) {
            if (this.animation_length / this.animation_frame_map[this.frame_count] < this.deltaTimer) {
                this.frame_count++;
                this.deltaTimer = 0;
            }
        } else if (this.animation_length / this.animation_frame_map[this.frame_count] < this.deltaTimer) {
            this.frame_count++;
            this.deltaTimer = 0;
        }
    }
    draw(position: Position, size: Size, direction: string) {
        if (direction === "right") {
            this.context.drawImage(
                this.sprite,
                this.frame_width * this.frame_count,
                0,
                this.frame_width,
                this.frame_height,
                position.x,
                position.y,
                size.width,
                size.height
            );
        } else if (direction === "left") {
            this.context.save();
            this.context.translate(position.x + size.width, position.y);
            this.context.scale(-1, 1);
            this.context.drawImage(
                this.sprite,
                this.frame_width * this.frame_count,
                0,
                this.frame_width,
                this.frame_height,
                0,
                0,
                size.width,
                size.height
            );
            this.context.restore();
        }
    }
}

export default class Animations {
    size: Size;
    api: string;
    url: string;
    image: HTMLImageElement;
    color: string;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    test: Animation;
    position: Position;
    frames: FrameState;
    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        frames: FrameState,
        position: Position,
        size: Size
    ) {
        this.canvas = canvas;
        this.context = context;
        this.frames = frames;
        this.api = "https://api.thecatapi.com/v1/images/search";
        this.url = undefined;
        this.image = undefined;
        this.size = size;
        this.position = position;
        this.color = `rgb(${randomNumber(70, 255)}, ${randomNumber(50, 140)}, ${randomNumber(70, 255)})`;
        this.test = new Animation(
            this.canvas,
            this.context,
            this.frames,
            "src/game/characters/Fighter/sprite_zumbi.png",
            5,
            370,
            410,
            0.6
        );
    }
    animation(direction: string) {
        this.test.frameLoop(this.frames);
        this.test.draw(this.position, this.size, direction);
    }
    getPlayerImage() {
        axios.get(this.api).then((response) => {
            this.url = response.data[0].url;
            this.image = new Image(this.size.width - 10, this.size.height - 10);
            this.image.src = this.url;
        });
    }
}
