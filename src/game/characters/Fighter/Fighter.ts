import BaseAttacks from "../BaseAttacks";
import { Animation, AnimationOptions } from "../../classes/Animations";

export default class Fighter extends BaseAttacks {
    animation_map: {
        [key: string]: AnimationOptions;
    };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);

        this.animation_map = {
            standing: {
                name: "standing",
                sprite_sheet_url: "src/game/characters/Fighter/sprite_zumbi.png",
                frame_length: 5,
                frame_width: 370,
                frame_height: 410,
                frame_position_offset: { x: 0, y: 0 },
                animation_length: 0.6,
                animation_frame_map: [0.12, 0.3, 0.45, 0.6, 0.8, 1],
            },
            punching: {
                name: "noMovement",
                sprite_sheet_url: "src/game/characters/Fighter/sprite_zumbi.png",
                frame_length: 7,
                frame_width: 370,
                frame_height: 410,
                frame_position_offset: { x: 5, y: 0 },
                animation_length: 0.2,
                animation_frame_map: [0.05, 0.1, 0.2, 0.4, 0.45, 0.5, 0.6, 1],
            },
        };

        this.animation.animations = [];
        Object.entries(this.animation_map).forEach(([key, value]) => {
            this.animation.animations.push(new Animation(this.canvas, this.context, this.frames, value));
        });
    }
}
