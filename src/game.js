import baseObj from './Objects/base.js'
import cursorObj from './Objects/cursor.js'
import { getEnemyColor } from './Objects/enemy.js'
import createEnemy from './Objects/enemy.js'
import createTurret from './Objects/turret.js'
import {
    BASE_LOW_HEALTH_THRESHOLD,
    CURSOR_SIZE,
    ENEMY_DAMAGE_VALUES,
    ENEMIES_PER_ROUND,
    ENEMY_SPAWN_INTERVAL,
    FINAL_ROUND,
    MAX_TURRETS_PER_ROUND,
    PREPARATION_TIME,
    TURRET_DAMAGE,
    TURRET_FIRING_DISTANCE,
} from './const.js'
import createProjectile from './Objects/projectile.js'

const { collides, init, initKeys, keyPressed, onKey, GameLoop, Sprite, Text } = kontra
const { canvas } = init()
initKeys()

let gameStarted = false
let gamePaused = false
let currentRound = 0
let selectedTurret = null
let timeSinceSpawn = 0
let timeLeftBeforeNextRound = 1
let base = null
let cursor = null
let roundInfo = null
let sprites = []
let enemies = []
let turrets = []
let projectiles = []
let enemiesSpawned = [{
    1: 0
}, {
    1: 0,
    2: 0
}, {
    1: 0,
    2: 0,
    3: 0
}]
let cursorImage = new Image()
cursorImage.src = 'assets/cursor.png'
cursorImage.onload = () => {
    cursor = Sprite(cursorObj(cursorImage).properties)
}

const startGame = () => {
    currentRound = 0
    timeSinceSpawn = 0
    timeLeftBeforeNextRound = PREPARATION_TIME
    base = Sprite(baseObj().properties)
    roundInfo = Text({
        text: '',
        font: '20px Arial',
        color: 'black',
        x: 320,
        y: 64,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
    })
    sprites = [
        base,
        cursor,
        roundInfo
    ]
    enemies = []
    turrets = []
    projectiles = []
    enemiesSpawned = [{
        1: 0
    }, {
        1: 0,
        2: 0
    }, {
        1: 0,
        2: 0,
        3: 0
    }]

    loop.start()
}

const endRound = () => {
    timeLeftBeforeNextRound = PREPARATION_TIME
    currentRound++
}

const endGame = (win) => {
    win ? alert("You won!") : alert("Game over")

    gameStarted = false
    loop.stop()
}

const addEnemy = (level) => {
    const enemy = createEnemy(level)
    enemies.push(Sprite(enemy.properties))
    enemiesSpawned[currentRound][level] = enemiesSpawned[currentRound][level] + 1
}

const removeEnemy = (index) => {
    enemies.splice(index, 1)
}

const removeProjectile = (index) => {
    projectiles.splice(index, 1)
}

const addTurret = (x, y) => {
    const turret = createTurret(x, y)
    turrets.push(Sprite(turret.properties))
}

const addProjectile = (x, y, enemy) => {
    const projectile = createProjectile("friendly", x, y, enemy)
    projectiles.push(Sprite(projectile.properties))
}

const damageBase = (enemyIndex) => {
    const enemyDamage = ENEMY_DAMAGE_VALUES[enemies[enemyIndex].level]
    base.health -= enemyDamage
    if (base.health <= BASE_LOW_HEALTH_THRESHOLD) {
        base.color = "red"
    }
    if (base.health <= 0) {
        endGame(false)
    } else {
        removeEnemy(enemyIndex)
    }
}

const damageEnemy = (enemyIndex, projectileIndex) => {
    const turretDamage = TURRET_DAMAGE
    const enemy = enemies[enemyIndex]
    enemy.color = "red"
    enemy.health -= turretDamage
    if (enemy.health <= 0) {
        removeEnemy(enemyIndex)
    }
    removeProjectile(projectileIndex)
}

const shootTurretAtEnemy = (turretIndex, enemyIndex) => {
    const turret = turrets[turretIndex]
    const enemy = enemies[enemyIndex]
    addProjectile(turret.x, turret.y, enemy)
}

onKey('enter', () => {
    if (!gameStarted) { 
        gameStarted = true
        startGame()
    } else {
        gamePaused = !gamePaused
        gamePaused ? loop.stop() : loop.start()
    }
})

const loop = GameLoop({
    update: (dt) => {
        if (timeLeftBeforeNextRound > 0) {
            roundInfo.text = `${Math.ceil(timeLeftBeforeNextRound)} seconds until enemies spawn`
            timeLeftBeforeNextRound -= dt
            if (timeLeftBeforeNextRound <= 0) {
                roundInfo.text = currentRound === FINAL_ROUND ? "Final Round" : `Round ${currentRound + 1}` 
            }
        } else {   
            timeSinceSpawn += dt
        }

        if (timeSinceSpawn >= ENEMY_SPAWN_INTERVAL && timeLeftBeforeNextRound <= 0) {
            const enemiesToSpawn = ENEMIES_PER_ROUND[currentRound]
            const enemiesSpawnedThisRound = enemiesSpawned[currentRound]
            if (enemiesToSpawn[1] && enemiesSpawnedThisRound[1] < enemiesToSpawn[1]) {
                addEnemy(1)
            } else if (enemiesToSpawn[2] && enemiesSpawnedThisRound[2] < enemiesToSpawn[2]) {
                addEnemy(2)
            } else if (enemiesToSpawn[3] && enemiesSpawnedThisRound[3] < enemiesToSpawn[3]) {
                addEnemy(3)
            } else if (!enemies.length) {
                currentRound < FINAL_ROUND ? endRound() : endGame(true)
            }

            timeSinceSpawn = 0
        }

        onKey('w', () => {
            cursor.y -= CURSOR_SIZE
        })
        onKey('s', () => {
            cursor.y += CURSOR_SIZE
        })
        onKey('a', () => {
            cursor.x -= CURSOR_SIZE
        })
        onKey('d', () => {
            cursor.x += CURSOR_SIZE
        })

        onKey('space', () => {
            turrets.length < MAX_TURRETS_PER_ROUND[currentRound] && addTurret(cursor.x, cursor.y)
        })

        sprites.forEach(sprite => !!sprite && sprite.update())
        enemies.forEach((enemy, i) => {
            enemy.color = getEnemyColor(enemy.level)
            enemy.update()
            collides(enemy, base) && damageBase(i)
        })
        projectiles.forEach((projectile, i) => {
            projectile.update()
            for (let x = 0; x < enemies.length; x++) {
                if (collides(enemies[x], projectile)) {
                    damageEnemy(x, i)
                    break
                }
            }
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > canvas.width || projectile.y > canvas.height) {
                removeProjectile(i)
            }
        })
        turrets.forEach((turret, i) => {
            turret.timeSinceAttack += dt
            if (turret.timeSinceAttack >= 1) {
                for (let x = 0; x < enemies.length; x++) {
                    if (turret.y - TURRET_FIRING_DISTANCE / 2 <= enemies[x].y && enemies[x].y <= turret.y + TURRET_FIRING_DISTANCE / 2) {
                        shootTurretAtEnemy(i, x)
                        break
                    }
                }
                turret.timeSinceAttack = 0
            }
            turret.update()
        })
    },
    render: () => {
        turrets.forEach(turret => turret.render())
        enemies.forEach(enemy => enemy.render())
        projectiles.forEach(projectile => projectile.render())
        sprites.forEach(sprite => !!sprite && sprite.render())
    }
})
