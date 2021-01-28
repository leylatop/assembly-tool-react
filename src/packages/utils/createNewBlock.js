function createNewBlock(data = {}) {
    let {top, left, component} = data;
    return {
        top,
        left,
        adjustPosition: true,
        componentKey: component.key,
        focus: false,
    }
}

export default createNewBlock;