import { stat } from "fs"

let CommondExecute = {
    undo: ()=> {},
    redo: ()=> {}
}
let Commond =  {
    name: '',
    keyboard: '' || [],
    execute: (data) => CommondExecute
}

let CommondManager = {
    queue: [],
    current: 0,
}


function createCommander() {
    const state = {
        commands: {}
    }

    const registry = (data = {}) => {
        state.commands[data.name] = () => {
            commands.execute()
        }
    }
    return {
        registry
    }
}

export default Commond;