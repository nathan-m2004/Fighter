import { InputState } from "../classes/Player";
import Fighter from "./Fighter";

export type Characters = Fighter;

type AttackList = { attacking: boolean; direction: string; frameStart: number; frameLength: number };

export type AttackStates = {
    list: { [key: string]: AttackList };
    size: number;
    canAttack: boolean;
    attackCooldown: number;
    attackFrameStart: number;
    attacking: boolean;
    map: {
        [key: string]: {
            x: number;
            y: number;
            width: number;
            height: number;
            keys: { pressed: boolean[]; notPressed: boolean[] };
            onGround: { checkFor: boolean; noCheck: boolean };
            attack: AttackList;
            attackKey: InputState;
            velocity: { x: number; y: number; noChange: boolean };
        };
    };
    hitbox: {
        show: boolean;
    };
};
