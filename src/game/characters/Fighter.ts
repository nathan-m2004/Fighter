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
            hitbox: {
                show: true,
                map: {},
            },
        };
    }
    lightAttack() {
        this.attack.hitbox.map = {
            left: {
                x: this.position.x - this.size.width - this.attack.size,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: this.size.height,
            },
            leftUp: {
                x: this.position.x,
                y: this.position.y,
                width: -this.size.width - this.attack.size,
                height: -this.size.height - this.attack.size,
            },
            leftDown: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
            },
            right: {
                x: this.position.x + this.size.width,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: this.size.height,
            },
            rightUp: {
                x: this.position.x + this.size.width,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
            },
            rightDown: {
                x: this.position.x + this.size.width,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
            },
            down: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: this.size.width,
                height: this.size.height + this.attack.size,
            },
            downLeftGround: {
                x: this.position.x,
                y: this.position.y + this.size.height,
                width: -this.size.width - this.attack.size,
                height: this.size.height + this.attack.size,
            },
            downRightGround: {
                x: this.position.x + this.size.width,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
            },
            downGround: {
                x: this.position.x - this.attack.size / 2,
                y: this.position.y + this.size.height,
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
            },
            up: {
                x: this.position.x - this.attack.size / 2,
                y: this.position.y,
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
            },
        };

        // DOWN LEFT IN THE GROUND
        if (
            this.keys.down.pressed &&
            this.keys.left.pressed &&
            this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "downLeftGround";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

            this.velocity.x = this.groundAttackMovement.x;
            this.velocity.y = -this.groundAttackMovement.y;
        }
        // DOWN RIGHT IN THE GROUND
        if (
            this.keys.down.pressed &&
            this.keys.right.pressed &&
            this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "downRightGround";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

            this.velocity.x = -this.groundAttackMovement.x;
            this.velocity.y = -this.groundAttackMovement.y;
        }
        // DOWN IN THE GROUND
        if (
            this.keys.down.pressed &&
            this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "downGround";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

            this.velocity.x = 0;
            this.velocity.y = -this.groundAttackMovement.y;
        }
        // LEFT UP
        if (
            this.keys.left.pressed &&
            this.keys.up.pressed &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "leftUp";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // LEFT DOWN IN AIR
        if (
            this.keys.left.pressed &&
            this.keys.down.pressed &&
            !this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "leftDown";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // LEFT
        if (
            this.keys.left.pressed &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "left";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // RIGHT UP
        if (
            this.keys.right.pressed &&
            this.keys.up.pressed &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "rightUp";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // RIGHT DOWN IN AIR
        if (
            this.keys.right.pressed &&
            this.keys.down.pressed &&
            !this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "rightDown";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // RIGHT
        if (
            this.keys.right.pressed &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "right";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // UP
        if (
            this.keys.up.pressed &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "up";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;
        }
        // DOWN IN THE AIR
        if (
            this.keys.down.pressed &&
            !this.movement.onGround &&
            this.keys.lightAttack.pressed &&
            this.attack.canAttack &&
            !this.attack.attacking &&
            this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
        ) {
            this.attack.attacking = true;
            this.attack.list.lightAttack.direction = "down";
            this.attack.list.lightAttack.attacking = true;
            this.attack.list.lightAttack.frameStart = this.frames.currentFrame;
            this.attack.attackFrameStart = this.attack.list.lightAttack.frameStart;

            this.velocity.x = 0;
            this.velocity.y = 0;
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
                const attack = this.attack.hitbox.map[direction];
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
