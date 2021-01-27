function createVisualEditorConfig() {
    const componentList = [];
    const componentMap = {};
    const registry = function(type, options) {
        componentList.push(options);
        componentMap[type] = options;
    }
    return {
        componentList,
        componentMap,
        registry
    }
}

export default createVisualEditorConfig;