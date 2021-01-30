// // import { CommandExecute } from './commond';
// import React, {useState, useEffect} from 'react';

// export interface CommandExecute {
//     undo: () => void,
//     redo: () => void,
// }

// export interface Command {
//     name: string,
//     keyboard?: string | string[],
//     excute:(...args: any[]) => CommandExecute,
// }

// export interface CommandManager {
//     queue: CommandExecute[],
//     current: number,
// }

// export function useCommander() {
//     // queue: [] as CommandExecute[],
//     let [state, setState] = useState({
//         commands:{} as Record<string, (...args: any[])=>void>
//     });
//     // const state = {
//     //     commands: {} as Record<string, (...args: any[])=>void>
//     // }

//     // useEffect(()=> {

//     // })

//     setState = (command: Command) => {
//         state.commands[command.name] = (...args) => {
//             command.excute(...args);
//         }
//     }

//     return {
//         setState,
//     }
// }