import Player from "../classes/Player";
import { AttackStates } from "./types";

export default class Fighter extends Player {
    attack: AttackStates;
    groundAttackMovement: { x: number; y: number };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);

        this.groundAttackMovement = { x: 70, y: 150 };
        this.attack = {
            size: 50,
            canAttack: true,
            attackCooldown: 500,
            attackFrameStart: 0,
            attacking: false,
            map: {},
            hitbox: {
                show: true,
            },
        };

        this.attack.map = {
            noMovementLeft: {
                x: { current: 0, offset: -this.size.width - this.attack.size + 50 },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size - 50,
                height: this.size.height,
                direction: "left",
                keys: { pressed: [], notPressed: [this.keys.down, this.keys.up, this.keys.left, this.keys.right] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 300,
                frameToUnlockMovement: 50,
                stopMovement: { bool: true, frame: 50 },
            },
            noMovementRight: {
                x: { current: 0, offset: this.size.width - this.attack.size + 50 },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size - 50,
                height: this.size.height,
                direction: "right",
                keys: { pressed: [], notPressed: [this.keys.down, this.keys.up, this.keys.left, this.keys.right] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 300,
                frameToUnlockMovement: 50,
                stopMovement: { bool: true, frame: 50 },
            },
            left: {
                x: { current: 0, offset: -this.size.width - this.attack.size },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: this.size.height,
                direction: "left",
                keys: { pressed: [this.keys.left], notPressed: [this.keys.down, this.keys.up] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            leftUp: {
                x: { current: 0, offset: 0 },
                y: { current: 0, offset: 0 },
                width: -this.size.width - this.attack.size,
                height: -this.size.height - this.attack.size,
                direction: "left",
                keys: { pressed: [this.keys.left, this.keys.up], notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            leftDown: {
                x: { current: 0, offset: 0 },
                y: { current: 0, offset: this.size.height },
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
                direction: "left",
                keys: { pressed: [this.keys.down, this.keys.left], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            right: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: this.size.height,
                direction: "right",
                keys: {
                    pressed: [this.keys.right],
                    notPressed: [this.keys.down, this.keys.up],
                },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            rightUp: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
                direction: "right",
                keys: { pressed: [this.keys.right, this.keys.up], notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            rightDown: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                direction: "right",
                keys: { pressed: [this.keys.right, this.keys.down], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            down: {
                x: { current: 0, offset: 0 },
                y: { current: 0, offset: this.size.height },
                width: this.size.width,
                height: this.size.height + this.attack.size,
                direction: undefined,
                keys: { pressed: [this.keys.down], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            downLeftGround: {
                x: { current: 0, offset: 0 },
                y: { current: 0, offset: this.size.height },
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
                direction: "left",
                keys: { pressed: [this.keys.down, this.keys.left], notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: this.groundAttackMovement.x, y: -this.groundAttackMovement.y, noChange: false },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            downRightGround: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                direction: "right",
                keys: { pressed: [this.keys.down, this.keys.right], notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: -this.groundAttackMovement.x, y: -this.groundAttackMovement.y, noChange: false },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            downGround: {
                x: { current: 0, offset: -this.attack.size / 2 },
                y: { current: 0, offset: +this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                direction: undefined,
                keys: {
                    pressed: [this.keys.down],
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: true, noCheck: false },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: 0, y: -this.groundAttackMovement.y, noChange: false },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            up: {
                x: { current: 0, offset: -this.attack.size / 2 },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
                direction: undefined,
                keys: {
                    pressed: [this.keys.up],
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: false, noCheck: true },
                attacking: false,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
        };
    }
    lightAttack() {
        for (const key in this.attack.map) {
            const attack = this.attack.map[key];
            const keysPressed = attack.keys.pressed.every((element) => element.pressed === true);
            const keysNotPressed = attack.keys.notPressed.every((element) => element.pressed === false);
            const groundCheck = attack.onGround.noCheck ? true : attack.onGround.checkFor === this.movement.onGround;
            const directionCheck = attack.direction ? attack.direction === this.movement.direction : true;

            if (
                groundCheck &&
                keysPressed &&
                keysNotPressed &&
                directionCheck &&
                attack.attackKey.pressed &&
                this.attack.canAttack &&
                !this.attack.attacking &&
                this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
            ) {
                this.attack.attacking = true;
                attack.attacking = true;
                attack.frameStart = this.frames.currentFrame;
                this.attack.attackFrameStart = attack.frameStart;

                if (!attack.velocity.noChange) {
                    this.velocity.x = attack.velocity.x;
                    this.velocity.y = attack.velocity.y;
                }
            }

            console.log(attack);
            if (attack.attacking) {
                attack.x.current = this.position.x + attack.x.offset;
                attack.y.current = this.position.y + attack.y.offset;

                const currentFrame = this.frames.currentFrame - attack.frameStart;

                if (currentFrame >= attack.frameToUnlockMovement) {
                    this.movement.canMove = true;
                } else {
                    this.movement.canMove = false;
                }

                if (attack.stopMovement.bool && currentFrame >= attack.stopMovement.frame) {
                    this.velocity.y = 0;
                    this.velocity.x = 0;
                }

                if (currentFrame >= attack.frameLength) {
                    this.attack.attacking = false;
                    attack.attacking = false;
                    return;
                }

                if (this.attack.hitbox.show) {
                    this.context.fillStyle = "green";
                    this.context.fillRect(attack.x.current, attack.y.current, attack.width, attack.height);
                }
            }
        }
    }
    handleAttacks() {
        if (this.keys.lightAttack.pressed) {
            this.lightAttack();
        } else if (this.attack.attacking) {
            this.lightAttack();
        }
    }
}
