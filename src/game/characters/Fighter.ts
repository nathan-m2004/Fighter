import Player from "../classes/Player";
import { Attack, AttackStates } from "./types";

export default class Fighter extends Player {
    attack: AttackStates;
    groundAttackMovement: { x: number; y: number };
    test: { readonly current: void };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);

        this.groundAttackMovement = { x: 70, y: 150 };
        this.attack = {
            size: 50,
            canAttack: true,
            attackCooldown: 500,
            attackFrameStart: 0,
            get current() {
                for (const key in this.map) {
                    const attack = this.map[key];
                    if (attack.attacking.bool) {
                        return key;
                    }
                }
            },
            map: {},
            hitbox: {
                show: true,
            },
        };

        this.attack.map = {
            noMovement: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size - 50,
                height: this.size.height,
                directional: { bool: true, direction: this.movement.direction },
                keys: {
                    pressed: [],
                    sideKeysPressed: false,
                    notPressed: [this.keys.down, this.keys.up, this.keys.left, this.keys.right],
                },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: { bool: false, hit: false, framesToHit: 100 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 300,
                frameToUnlockMovement: 50,
                stopMovement: { bool: true, frame: 50 },
            },
            side: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: this.size.height,
                directional: { bool: true, direction: this.movement.direction },
                keys: {
                    pressed: [],
                    sideKeysPressed: true,
                    notPressed: [this.keys.down, this.keys.up],
                },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: { bool: false, hit: false, framesToHit: 100 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            sideUp: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: -this.size.height - this.attack.size,
                directional: { bool: true, direction: this.movement.direction },
                keys: { pressed: [this.keys.up], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                attacking: { bool: false, hit: false, framesToHit: 100 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            sideDown: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: true, direction: this.movement.direction },
                keys: { pressed: [this.keys.down], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attacking: { bool: false, hit: false, framesToHit: 100 },
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
                directional: { bool: false, direction: undefined },
                keys: { pressed: [this.keys.down], sideKeysPressed: false, notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                attacking: { bool: false, hit: false, framesToHit: 100 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
            downSideGround: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: true, direction: this.movement.direction },
                keys: { pressed: [this.keys.down], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                attacking: { bool: false, hit: false, framesToHit: 100 },
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
                directional: { bool: false, direction: undefined },
                keys: {
                    pressed: [this.keys.down],
                    sideKeysPressed: false,
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: true, noCheck: false },
                attacking: { bool: false, hit: false, framesToHit: 100 },
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
                directional: { bool: false, direction: undefined },
                keys: {
                    pressed: [this.keys.up],
                    sideKeysPressed: false,
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: false, noCheck: true },
                attacking: { bool: false, hit: false, framesToHit: 100 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                frameStart: 0,
                frameLength: 200,
                frameToUnlockMovement: 100,
                stopMovement: { bool: true, frame: 100 },
            },
        };
    }
    checkMap() {
        for (const key in this.attack.map) {
            const attack = this.attack.map[key];

            const keysPressed = attack.keys.pressed.every((element) => element.pressed === true);
            const keysNotPressed = attack.keys.notPressed.every((element) => element.pressed === false);
            const groundCheck = attack.onGround.noCheck ? true : attack.onGround.checkFor === this.movement.onGround;
            const sideKeyCheck = attack.keys.sideKeysPressed ? this.keys.left.pressed || this.keys.right.pressed : true;

            if (attack.directional)
                if (
                    groundCheck &&
                    keysPressed &&
                    keysNotPressed &&
                    sideKeyCheck &&
                    attack.attackKey.pressed &&
                    this.attack.canAttack &&
                    this.frames.currentFrame - this.attack.attackFrameStart >= this.attack.attackCooldown
                ) {
                    attack.attacking.bool = true;
                    this.attack.canAttack = false;
                    attack.frameStart = this.frames.currentFrame;
                    this.attack.attackFrameStart = attack.frameStart;
                }

            if (attack.attacking.bool) {
                // DIRECTIONAL STUFF
                if (attack.directional.bool) {
                    if (this.frames.currentFrame === attack.frameStart) {
                        attack.directional.direction = this.movement.direction;
                    }
                    if (attack.directional.direction === "right") {
                        attack.x.current = this.position.x + attack.x.offset;
                        attack.y.current = this.position.y + attack.y.offset;
                    } else if (attack.directional.direction === "left") {
                        attack.x.current = this.position.x - attack.x.offset + this.size.width - attack.width;
                        attack.y.current = this.position.y + attack.y.offset;
                    }
                } else {
                    attack.x.current = this.position.x + attack.x.offset;
                    attack.y.current = this.position.y + attack.y.offset;
                }

                //VELOCITY STUFF
                if (!attack.velocity.noChange && attack.directional.bool) {
                    if (attack.directional.direction === "right") {
                        this.velocity.x = attack.velocity.x;
                        this.velocity.y = attack.velocity.y;
                    }
                    if (attack.directional.direction === "left") {
                        this.velocity.x = -attack.velocity.x;
                        this.velocity.y = attack.velocity.y;
                    }
                } else if (!attack.velocity.noChange) {
                    this.velocity.x = attack.velocity.x;
                    this.velocity.y = attack.velocity.y;
                }

                const currentFrame = this.frames.currentFrame - attack.frameStart;

                if (currentFrame >= attack.attacking.framesToHit) {
                    attack.attacking.hit = true;
                } else {
                    attack.attacking.hit = false;
                }

                // MOVEMENT UNLOCK STUFF
                if (currentFrame >= attack.frameToUnlockMovement) {
                    this.movement.canMove = true;
                } else {
                    this.movement.canMove = false;
                }

                // STOP MOVEMENT STUFF
                if (attack.stopMovement.bool && currentFrame >= attack.stopMovement.frame) {
                    this.velocity.y = 0;
                    this.velocity.x = 0;
                }

                // END OF THE ATTACK
                if (currentFrame >= attack.frameLength) {
                    attack.attacking.bool = false;
                    this.attack.canAttack = true;
                    return;
                }

                if (this.attack.hitbox.show) {
                    if (attack.attacking.hit) {
                        this.context.fillStyle = "rgba(172, 175, 25, 0.7)";
                    } else {
                        this.context.fillStyle = "rgba(172, 175, 25, 0.2)";
                    }
                    this.context.fillRect(attack.x.current, attack.y.current, attack.width, attack.height);
                }
            }
        }
    }
    handleAttacks() {
        if (this.keys.lightAttack.pressed) {
            this.checkMap();
        } else if (this.attack.current) {
            this.checkMap();
        }
    }
    currentAttack() {}
}
