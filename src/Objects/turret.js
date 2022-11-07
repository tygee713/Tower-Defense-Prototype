const { Sprite } = kontra

const shootClosestEnemy = () => {

}

const upgrade = () => {

}

const takeDamage = () => {

}

const repair = () => {

}

const create = () => {

}

const createTurret = (x, y, _type) => {
    return {
        properties: {
            x,
            y,
            color: 'Orange',
            width: 32,
            height: 32,
            timeSinceAttack: 0,
            anchor: { x: 0.5, y: 0.5 }
        }
    }
}

export default createTurret