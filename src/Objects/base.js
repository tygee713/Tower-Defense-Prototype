import { CURSOR_SIZE } from "../const.js"

const { getCanvas } = kontra

const takeDamage = () => {

}

const base = () => {
    const canvas = getCanvas()
    const width = 4 * CURSOR_SIZE
    return {
        properties: {
            x: canvas.width / 2,
            y: canvas.height - 4 * CURSOR_SIZE - 16,
            color: 'orange',
            width,
            height: CURSOR_SIZE,
            health: 100,
            anchor: { x: 0.5, y: 0.5 }
        },
        
    }
    
}

export default base