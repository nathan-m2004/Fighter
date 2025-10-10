import { FrameState, Position, Size } from "./Player";
import { randomNumber } from "../util";
import Movement from "./Movement";
import { AttackStates } from "../characters/types";

export type AnimationOptions = {
    name: string;
    states: { true: string[]; false: string[] };
    sprite_sheet_url: string;
    frame_length: number;
    frame_width: number;
    frame_height: number;
    frame_position_offset: { x: number; y: number };
    animation_frame_map: number[];
    lock: boolean;
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
    frames: FrameState;
    deltaTimer: number;
    states: { true: string[]; false: string[] };
    frame_position_offset: { x: number; y: number };
    movement: Movement;
    lockedDirection: string | undefined;
    attack: AttackStates;
    name: string;
    lock: boolean;
    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        frames: FrameState,
        options: AnimationOptions,
        movement: Movement,
        attack: AttackStates
    ) {
        this.canvas = canvas;
        this.context = context;
        this.frames = frames;

        this.deltaTimer = 0;
        this.frame_length = options.frame_length; // amount of frames in the animation
        this.frame_count = 0;

        this.frame_height = options.frame_height;
        this.frame_width = options.frame_width;
        this.frame_position_offset = options.frame_position_offset; // offset position in amount of frames
        this.sprite_sheet_url = options.sprite_sheet_url;
        this.sprite = new Image();
        this.sprite.src = this.sprite_sheet_url;

        this.name = options.name;
        this.attack = attack;
        this.movement = movement;
        this.lockedDirection;
        this.lock = options.lock;

        this.states = options.states;
        this.animation_frame_map = options.animation_frame_map;
    }
    frameLoop(frames: FrameState, callbackFn: () => void) {
        this.frames = frames;
        this.deltaTimer += this.frames.deltaTime;
        if (this.frame_count > this.frame_length) {
            this.frame_count = 0;
            this.lockedDirection = undefined;
            callbackFn();
        }
        if (this.animation_frame_map[this.frame_count] < this.deltaTimer) {
            this.frame_count++;
            this.deltaTimer = 0;
        }
    }
    draw(position: Position, size: Size) {
        const condition = this.lockedDirection ? this.lockedDirection : this.movement.direction;
        if (condition === "right") {
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
        } else if (condition === "left") {
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
    playing_animation: string;
    lockedAnimation: string | undefined;
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
        this.playing_animation = "standing";
        this.lockedAnimation = undefined;
    }
    drawLoop() {
        if (this.lockedAnimation) {
            const lockedAnim = this.animations.find((anim) => anim.name === this.lockedAnimation);
            if (lockedAnim) {
                lockedAnim.frameLoop(this.frames, () => {
                    this.lockedAnimation = undefined;
                    lockedAnim.frame_count = 0;
                });
                lockedAnim.draw(this.position, this.size);
            }
        } else {
            this.animations.forEach((animation) => {
                const check = this.checkStates(animation);

                if (check) {
                    this.playing_animation = animation.name;

                    if (animation.lock) {
                        this.lockedAnimation = animation.name;
                        animation.lockedDirection = animation.movement.direction;
                    }
                    animation.frameLoop(this.frames, () => {});
                    animation.draw(this.position, this.size);
                }
            });
        }
    }
    checkStates(animation: Animation) {
        const trueStates = animation.states.true.every((state) => {
            if (animation.attack.map[state] && animation.attack.map[state].attacking.bool === true) {
                return true;
            } else if (animation.movement.booleans[state] === true) {
                return true;
            }
        });
        const falseStates = animation.states.false.every((state) => {
            if (animation.attack.map[state] && animation.attack.map[state].attacking.bool === false) {
                return true;
            } else if (animation.movement.booleans[state] === false) {
                return true;
            }
        });
        return falseStates === true && trueStates === true;
    }
}
