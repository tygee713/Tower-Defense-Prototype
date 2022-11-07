const cursorObj = (image) => {
    return {
        properties: {
            x: 16,
            y: 16,
            image,
            anchor: { x: 0.5, y: 0.5 }
        }
    }
}

export default cursorObj