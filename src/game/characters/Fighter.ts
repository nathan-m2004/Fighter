import Player from "../classes/Player";
import { AttackStates } from "./types";

export default class Fighter extends Player {
    attack: AttackStates;
    groundAttackMovement: { x: number; y: number };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);

        this.groundAttackMovement = { x: 70, y: 150 };
        this.attack = {
            list: {
                lightAttack: { attacking: false, direction: undefined, frameStart: 0, frameLength: 200 },
            },
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
    }
    lightAttack() {
        this.attack.map = {
            left: {
                x: this.position.x - this.size.width - this.attack.size,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: this.size.height,
                keys: { pressed: [this.keys.left.pressed], notPressed: [this.keys.down.pressed, this.keys.up.pressed] },
                onGround: { checkFor: undefined, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            leftUp: {
                x: this.position.x,
                y: this.position.y,
                width: -this.size.width - this.attack.size,
                height: -this.size.height - this.attack.size,
                keys: { pressed: [this.keys.left.pressed, this.keys.up.pressed], notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            leftDown: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
                keys: { pressed: [this.keys.down.pressed, this.keys.left.pressed], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            right: {
                x: this.position.x + this.size.width,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: this.size.height,
                keys: {
                    pressed: [this.keys.right.pressed],
                    notPressed: [this.keys.down.pressed, this.keys.up.pressed],
                },
                onGround: { checkFor: undefined, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            rightUp: {
                x: this.position.x + this.size.width,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
                keys: { pressed: [this.keys.right.pressed, this.keys.up.pressed], notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            rightDown: {
                x: this.position.x + this.size.width,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                keys: { pressed: [this.keys.right.pressed, this.keys.down.pressed], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            down: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: this.size.width,
                height: this.size.height + this.attack.size,
                keys: { pressed: [this.keys.down.pressed], notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
            downLeftGround: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
                keys: { pressed: [this.keys.down.pressed, this.keys.left.pressed], notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: this.groundAttackMovement.x, y: -this.groundAttackMovement.y, noChange: false },
            },
            downRightGround: {
                x: this.position.x + this.size.width,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                keys: { pressed: [this.keys.down.pressed, this.keys.right.pressed], notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: -this.groundAttackMovement.x, y: -this.groundAttackMovement.y, noChange: false },
            },
            downGround: {
                x: this.position.x - this.attack.size / 2,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                keys: {
                    pressed: [this.keys.down.pressed],
                    notPressed: [this.keys.left.pressed, this.keys.right.pressed],
                },
                onGround: { checkFor: true, noCheck: false },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: 0, y: -this.groundAttackMovement.y, noChange: false },
            },
            up: {
                x: this.position.x - this.attack.size / 2,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
                keys: {
                    pressed: [this.keys.up.pressed],
                    notPressed: [this.keys.left.pressed, this.keys.right.pressed],
                },
                onGround: { checkFor: false, noCheck: true },
                attack: this.attack.list.lightAttack,
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
            },
        };

        for (const key in this.attack.map) {
            const attack = this.attack.map[key];
            const keysPressed = attack.keys.pressed.every(Boolean);
            const keysNotPressed = attack.keys.notPressed.every((element) => element === false);
            const groundCheck = attack.onGround.noCheck ? true : attack.onGround.checkFor === this.movement.onGround;
            if (
                groundCheck &&
                keysPressed &&
                keysNotPressed &&
                attack.attackKey.pressed &&
                this.attack.canAttack &&
                !this.attack.attacking &&
                this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
            ) {
                this.attack.attacking = true;
                attack.attack.direction = key;
                attack.attack.attacking = true;
                attack.attack.frameStart = this.frames.currentFrame;
                this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

                if (!attack.velocity.noChange) {
                    this.velocity.x = attack.velocity.x;
                    this.velocity.y = attack.velocity.y;
                }
            }
        }

        // NO MOVEMENT INPUT
        if (
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = this.movement.direction;
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        if (this.attack.list.lightAttack.attacking) {
            const halfOfAnimation =
                this.frames.currentFrame - this.attack.list.lightAttack.frameStart >=
                this.attack.list.lightAttack.frameLength / 2;

            if (halfOfAnimation) {
                this.movement.canMove = true;
                if (
                    this.attack.list.lightAttack.direction === "downGround" ||
                    this.attack.list.lightAttack.direction === "downRightGround" ||
                    this.attack.list.lightAttack.direction === "downLeftGround"
                ) {
                    this.velocity.y = 0;
                    this.velocity.x = 0;
                }
            } else {
                this.movement.canMove = false;
            }

            const endOfAnimation =
                this.frames.currentFrame - this.attack.list.lightAttack.frameStart >=
                this.attack.list.lightAttack.frameLength;
            if (endOfAnimation) {
                this.attack.attacking = false;
                this.attack.list.lightAttack.attacking = false;
                return;
            }

            if (this.attack.hitbox.show) {
                const direction = this.attack.list.lightAttack.direction;
                const attack = this.attack.map[direction];
                this.context.fillStyle = "green";
                this.context.fillRect(attack.x, attack.y, attack.width, attack.height);
            }
        }
    }
    handleAttacks() {
        if (this.keys.lightAttack.pressed) {
            this.lightAttack();
        } else if (this.attack.list.lightAttack.attacking) {
            this.lightAttack();
        }
    }
}
