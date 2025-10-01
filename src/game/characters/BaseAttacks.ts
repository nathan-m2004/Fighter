import Player, { Position, Size } from "../classes/Player";
import { AttackStates } from "./types";

export default class BaseAttacks extends Player {
    player: Player;
    attack: AttackStates;
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        super(canvas, context, x, y, gravity);

        this.attack = {
            size: 50,
            canAttack: true,
            attackCooldownDelta: 6,
            attackFrameDelta: 0,
            groundAttackMovement: { x: 70, y: 150 },
            get current() {
                for (const key in this.map) {
                    const attack = this.map[key];
                    if (attack.attacking.bool) {
                        return attack;
                    }
                }
            },
            get currentsPositionSize() {
                for (const key in this.map) {
                    const attack = this.map[key];
                    const position: Position = { x: attack.x.current, y: attack.y.current };
                    const size: Size = { width: attack.width, height: attack.height };
                    if (attack.attacking.bool) {
                        return { position, size };
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
                directional: { bool: true, horizontal: this.movement.direction, vertical: undefined },
                keys: {
                    pressed: [],
                    sideKeysPressed: false,
                    notPressed: [this.keys.down, this.keys.up, this.keys.left, this.keys.right],
                },
                onGround: { checkFor: undefined, noCheck: true },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: false, frameDelta: 0.5 },
            },
            side: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: 0 },
                width: this.size.width + this.attack.size,
                height: this.size.height,
                directional: { bool: true, horizontal: this.movement.direction, vertical: undefined },
                keys: {
                    pressed: [],
                    sideKeysPressed: true,
                    notPressed: [this.keys.down, this.keys.up],
                },
                onGround: { checkFor: undefined, noCheck: true },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: false, frameDelta: 0.5 },
            },
            sideUp: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: -this.size.height - this.attack.size },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: true, horizontal: this.movement.direction, vertical: "up" },
                keys: { pressed: [this.keys.up], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: undefined, noCheck: true },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: false, frameDelta: 0.5 },
            },
            sideDown: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: true, horizontal: this.movement.direction, vertical: "down" },
                keys: { pressed: [this.keys.down], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: true, frameDelta: 0.5 },
            },
            down: {
                x: { current: 0, offset: 0 },
                y: { current: 0, offset: this.size.height },
                width: this.size.width,
                height: this.size.height + this.attack.size,
                directional: { bool: false, horizontal: undefined, vertical: "down" },
                keys: { pressed: [this.keys.down], sideKeysPressed: false, notPressed: [] },
                onGround: { checkFor: false, noCheck: false },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: true, frameDelta: 0.5 },
            },
            downSideGround: {
                x: { current: 0, offset: this.size.width },
                y: { current: 0, offset: this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: true, horizontal: this.movement.direction, vertical: "down" },
                keys: { pressed: [this.keys.down], sideKeysPressed: true, notPressed: [] },
                onGround: { checkFor: true, noCheck: true },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: {
                    x: -this.attack.groundAttackMovement.x,
                    y: -this.attack.groundAttackMovement.y,
                    noChange: false,
                },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: true, frameDelta: 1 },
            },
            downGround: {
                x: { current: 0, offset: -this.attack.size / 2 },
                y: { current: 0, offset: +this.size.height },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: false, horizontal: undefined, vertical: "down" },
                keys: {
                    pressed: [this.keys.down],
                    sideKeysPressed: false,
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: true, noCheck: false },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: 0, y: -this.attack.groundAttackMovement.y, noChange: false },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: true, frameDelta: 1 },
            },
            up: {
                x: { current: 0, offset: -this.attack.size / 2 },
                y: { current: 0, offset: -this.size.height - this.attack.size },
                width: this.size.width + this.attack.size,
                height: this.size.height + this.attack.size,
                directional: { bool: false, horizontal: undefined, vertical: "up" },
                keys: {
                    pressed: [this.keys.up],
                    sideKeysPressed: false,
                    notPressed: [this.keys.left, this.keys.right],
                },
                onGround: { checkFor: false, noCheck: true },
                hitPoints: 3,
                knockBack: { force: 200, stopTime: 10 },
                attacking: { bool: false, hit: false, framesToHitDelta: 1 },
                attackKey: this.keys.lightAttack,
                velocity: { x: undefined, y: undefined, noChange: true },
                firstFrame: true,
                frameTimeDelta: 0,
                frameLengthDelta: 3,
                frameToUnlockMovementDelta: 1.2,
                stopMovement: { bool: false, frameDelta: 0.5 },
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

            if (
                groundCheck &&
                keysPressed &&
                keysNotPressed &&
                sideKeyCheck &&
                attack.attackKey.pressed &&
                this.attack.canAttack &&
                this.attack.attackFrameDelta >= this.attack.attackCooldownDelta
            ) {
                attack.attacking.bool = true;
                this.attack.canAttack = false;
                attack.frameTimeDelta = 0;
                this.attack.attackFrameDelta = 0;
            }

            if (attack.attacking.bool) {
                attack.frameTimeDelta += this.frames.deltaTime;
                // DIRECTIONAL STUFF
                if (attack.directional.bool) {
                    if (attack.firstFrame) {
                        attack.directional.horizontal = this.movement.direction;
                    }
                    if (attack.directional.horizontal === "right") {
                        attack.x.current = this.position.x + attack.x.offset;
                        attack.y.current = this.position.y + attack.y.offset;
                    } else if (attack.directional.horizontal === "left") {
                        attack.x.current = this.position.x - attack.x.offset + this.size.width - attack.width;
                        attack.y.current = this.position.y + attack.y.offset;
                    }
                } else {
                    attack.x.current = this.position.x + attack.x.offset;
                    attack.y.current = this.position.y + attack.y.offset;
                }

                //VELOCITY STUFF
                if (!attack.velocity.noChange && attack.directional.bool) {
                    if (attack.directional.horizontal === "right") {
                        this.velocity.x = attack.velocity.x;
                        this.velocity.y = attack.velocity.y;
                    }
                    if (attack.directional.horizontal === "left") {
                        this.velocity.x = -attack.velocity.x;
                        this.velocity.y = attack.velocity.y;
                    }
                } else if (!attack.velocity.noChange) {
                    this.velocity.x = attack.velocity.x;
                    this.velocity.y = attack.velocity.y;
                }

                if (attack.frameTimeDelta >= attack.attacking.framesToHitDelta) {
                    attack.attacking.hit = true;
                } else {
                    attack.attacking.hit = false;
                }

                // MOVEMENT UNLOCK STUFF
                if (attack.frameTimeDelta >= attack.frameToUnlockMovementDelta) {
                    this.movement.canMove = true;
                } else {
                    this.movement.canMove = false;
                }

                // STOP MOVEMENT STUFF
                if (attack.stopMovement.bool && attack.frameTimeDelta >= attack.stopMovement.frameDelta) {
                    this.velocity.y = 0;
                    this.velocity.x = 0;
                }

                // END OF THE ATTACK
                if (attack.frameTimeDelta >= attack.frameLengthDelta) {
                    attack.firstFrame = true;
                    attack.attacking.bool = false;
                    this.attack.canAttack = true;
                    return;
                }

                if (attack.firstFrame) {
                    attack.firstFrame = false;
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
        this.attack.attackFrameDelta += this.frames.deltaTime;

        if (this.keys.lightAttack.pressed) {
            this.checkMap();
        } else if (this.attack.current) {
            this.checkMap();
        }
    }
}
