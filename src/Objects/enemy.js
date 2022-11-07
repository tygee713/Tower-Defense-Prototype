import { CURSOR_SIZE } from "../const.js"

const { getCanvas } = kontra

const buffer = 4
const positionMin = buffer
const positionMax = (CURSOR_SIZE * 1.5) - buffer

const shootClosestStructure = () => {

}

export const getEnemyColor = (level) => {
    return level === 1 ? "black" : level === 2 ? "blue" : "purple"
}

const createEnemy = (level) => {
    const health = level === 1 ? 100 : level === 2 ? 160 : 200
    const randomPosition = Math.floor(Math.random() * (positionMax - positionMin + 1) + positionMin)
    const canvas = getCanvas()
    return {
        properties: {
            x: canvas.width / 2 - CURSOR_SIZE + randomPosition,
            y: 96,
            color: getEnemyColor(level),
            dy: 0.5,
            level,
            health,
            width: CURSOR_SIZE / 2,
            height: CURSOR_SIZE / 2,
            anchor: { x: 0.5, y: 0.5 }
        }
        
    }
}

export default createEnemy