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
                return { side: "left", overlapX: overlapX, overlapY: overlapY };
            } else {
                return { side: "right", overlapX: overlapX, overlapY: overlapY };
            }
        } else {
            if (distanceY > 0) {
                return { side: "bottom", overlapX: overlapX, overlapY: overlapY };
            } else {
                return { side: "top", overlapX: overlapX, overlapY: overlapY };
            }
        }
    } else {
        return false;
    }
}
