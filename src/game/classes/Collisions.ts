import Fighter from "../characters/Fighter/Fighter";
import { rectangleRectangle } from "../collisions";
import MapObject from "./MapObject";

export default class Collisions {
    KNOCKBACK_FORCE_DIVISOR: number;
    DAMAGE_OVERLAP_FACTOR: number;
    MINIMUM_HEALTH: number;
    constructor() {
        this.KNOCKBACK_FORCE_DIVISOR = 2000;
        this.DAMAGE_OVERLAP_FACTOR = 100;
        this.MINIMUM_HEALTH = 1;
    }
    collisionAttackPlayer(playerA: Fighter, playerB: Fighter) {
        const attackPosition = playerA.attack.currentsPositionSize;
        const attackState = playerA.attack.current;

        if (!attackPosition && !attackState) {
            return;
        }

        if (playerA === playerB) {
            return;
        }

        const collision = rectangleRectangle(attackPosition, playerB);

        if (collision && playerB.health.vulnerable) {
            playerB.movement.knockedBack = true;
            const overlapSum = collision.overlapX + collision.overlapY;
            const hitValue = (overlapSum * playerB.health.points) / this.KNOCKBACK_FORCE_DIVISOR;

            playerB.health.gotHit = true;
            playerB.health.points -= Math.floor(
                attackState.hitPoints + (attackState.hitPoints * overlapSum) / this.DAMAGE_OVERLAP_FACTOR
            );
            if (playerB.health.points <= 0) {
                playerB.health.points = this.MINIMUM_HEALTH;
            }

            if (attackState.directional.vertical === "up") {
                playerB.velocity.y -= attackState.knockBack.force / hitValue;
            }
            if (attackState.directional.vertical === "down") {
                playerB.velocity.y += attackState.knockBack.force / hitValue;
            }
            if (attackState.directional.horizontal === "left") {
                playerB.velocity.x -= attackState.knockBack.force / hitValue;
            }
            if (attackState.directional.horizontal === "right") {
                playerB.velocity.x += attackState.knockBack.force / hitValue;
            }
        }
    }
    collisionPlayerObject(player: Fighter, objects: MapObject[]) {
        player.movement.onGround = false;

        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            const collision = rectangleRectangle(player, object);

            if (collision) {
                if (collision.side === "top" && !object.canGoInside) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.movement.jumpTimes = 0;
                    player.movement.dashCount = 0;
                    player.movement.onGround = true;
                }
                if (collision.side === "bottom" && !object.canGoInside) {
                    player.position.y = object.position.y + object.size.height;
                    player.velocity.y = 0;
                }
                if (collision.side === "left" && !object.canGoInside) {
                    player.position.x = object.position.x - player.size.width;
                    player.velocity.x = 0;
                }
                if (collision.side === "right" && !object.canGoInside) {
                    player.position.x = object.position.x + object.size.width;
                    player.velocity.x = 0;
                }

                if (
                    collision.side === "top" &&
                    object.canGoInside &&
                    player.velocity.y >= 0 &&
                    player.controls.keys.down.timeHoldingDelta <= player.controls.keys.down.delayToLeavePlataform
                ) {
                    player.velocity.y = 0;
                    player.position.y = object.position.y - player.size.height;
                    player.movement.jumpTimes = 0;
                    player.movement.dashCount = 0;
                    player.movement.onGround = true;
                }
                return;
            }
        }
    }
}
