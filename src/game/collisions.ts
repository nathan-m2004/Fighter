export function rectangleRectangle(objectA: any, objectB: any) {
    if (
        objectA.position.x + objectA.size.width >= objectB.position.x &&
        objectA.position.x <= objectB.position.x + objectB.size.width &&
        objectA.position.y + objectA.size.height >= objectB.position.y &&
        objectA.position.y <= objectB.position.y + objectB.size.height
    ) {
        const centerA = {
            x: objectA.position.x + objectA.size.width / 2,
            y: objectA.position.y + objectA.size.height / 2,
        };
        const centerB = {
            x: objectB.position.x + objectB.size.width / 2,
            y: objectB.position.y + objectB.size.height / 2,
        };

        const combinedWidths = objectA.size.width / 2 + objectB.size.width / 2;
        const combinedHeights = objectA.size.height / 2 + objectB.size.height / 2;

        const distanceX = centerA.x - centerB.x;
        const distanceY = centerA.y - centerB.y;

        const overlapX = combinedWidths - Math.abs(distanceX);
        const overlapY = combinedHeights - Math.abs(distanceY);

        if (overlapX < overlapY) {
            if (distanceX < 0) {
                return "left";
            } else {
                return "right";
            }
        } else {
            if (distanceY > 0) {
                return "bottom";
            } else {
                return "top";
            }
        }
    } else {
        return false;
    }
}

// USAR VETORES PARA SABER A DIREÇÃO DA COLISÃO
