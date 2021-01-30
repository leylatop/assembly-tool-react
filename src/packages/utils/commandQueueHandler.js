import useCommander from './commandHook';

function useVisualCommand() {
    let {commondState, setCommandState} = useCommander();

    setCommandState({
        name: 'delete',
        keyboard: [
            'backspace',
            'delete',
            'ctrl+d'
        ],
        execute: function() {
            console.log('执行删除命令')
            return {
                redo: function() {
                    console.log('重新执行删除命令')

                },
                undo: function() {
                    console.log('撤回删除命令')
                }
            }
        }
    })

    return {
        undo: commondState.commands.undo,
        redo: commondState.commands.redo,
        delete: commondState.commands.delete
    }
}

export default useVisualCommand;