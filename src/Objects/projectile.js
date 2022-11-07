const { Sprite } = kontra

const speed = 5

const createProjectile = (type, x, y, targetEnemy) => {
    const color = type == "friendly" ? "green" : "red"
    return {
        properties: {
            x,
            y,
            color,
            targetEnemy,
            width: 4,
            height: 4,
            anchor: { x: 0.5, y: 0.5 },
            update: function(_dt) {
                const { health, x: targetX, y: targetY } = targetEnemy
                const enemyAlive = health > 0
                const yDiff = enemyAlive ? targetY - y : y
                const xDiff = enemyAlive ? targetX - x : x
                const angle = enemyAlive ? Math.atan2(yDiff, xDiff) : this.angle

                this.angle = angle
    
                this.x += Math.cos(angle) * speed
                this.y += Math.sin(angle) * speed
            }
        }
    }
}

export default createProjectile