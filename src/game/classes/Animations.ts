import axios from "axios";
import { FrameState, Position, Size } from "./Player";
import { randomNumber } from "../util";

export type AnimationOptions = {
    name: string;
    sprite_sheet_url: string;
    frame_length: number;
    frame_width: number;
    frame_height: number;
    frame_position_offset: { x: number; y: number };
    animation_length: number;
    animation_frame_map: number[];
};

export class Animation {
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
    animation_name: string;
    frame_position_offset: { x: number; y: number };
    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        frames: FrameState,
        options: AnimationOptions
    ) {
        this.canvas = canvas;
        this.context = context;
        this.frames = frames;

        this.deltaTimer = 0;
        this.animation_length = options.animation_length; // length in delta time
        this.frame_length = options.frame_length; // amount of frames in the animation
        this.frame_count = 0;

        this.frame_height = options.frame_height;
        this.frame_width = options.frame_width;
        this.frame_position_offset = options.frame_position_offset; // offset position in amount of frames
        this.sprite_sheet_url = options.sprite_sheet_url;
        this.sprite = new Image();
        this.sprite.src = this.sprite_sheet_url;

        this.animation_name = options.name;
        this.animation_frame_map = options.animation_frame_map;
    }
    frameLoop(frames: FrameState) {
        this.frames = frames;
        this.deltaTimer += this.frames.deltaTime;
        if (this.frame_count > this.frame_length) {
            this.frame_count = 0;
        }
        if (this.animation_length / this.animation_frame_map[this.frame_count] < this.deltaTimer) {
            this.frame_count++;
            this.deltaTimer = 0;
        }
    }
    draw(position: Position, size: Size, direction: string) {
        if (direction === "right") {
            this.context.drawImage(
                this.sprite,
                this.frame_width * (this.frame_count + this.frame_position_offset.x),
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
                this.frame_width * (this.frame_count + this.frame_position_offset.x),
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
    color: string;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    position: Position;
    frames: FrameState;
    animations: Animation[];
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
        this.size = size;
        this.position = position;
        this.color = `rgb(${randomNumber(70, 255)}, ${randomNumber(50, 140)}, ${randomNumber(70, 255)})`;
        this.animations;
    }
    drawLoop(direction: string) {
        this.animations.forEach((animation) => {
            animation.frameLoop(this.frames);
            animation.draw(this.position, this.size, direction);
        });
    }
}
