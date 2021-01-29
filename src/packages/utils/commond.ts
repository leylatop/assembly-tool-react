import { CommandExecute } from './commond';
import { stat } from "fs"

export interface CommandExecute {
    undo: () => void,
    redo: () => void,
}

export interface Command {
    name: string,
    keyboard?: string | string[],
    excute:(...args: any[]) => CommandExecute,
}

export interface CommandManager {
    queue: CommandExecute[],
    current: number,
}

export function useCommander() {
    queue: [] as CommandExecute[],
    const state = {
        commands: {} as Record<string, (...args: any[])=>void>
    }

    const regitstry = (command: Command) => {
        state.commands[command.name] = (...args) => {
            command.excute(...args);
        }
    }

    return {
        regitstry
    }
}