import React, {useState} from 'react';

function useCommander() {
    let [commondState, setCommandState] = useState({
        current: -1,
        queue: [],
        commands: {}
    })

    // 设置命令队列
    // data = {
    //     name: '',                                                       //命令唯一标识
    //     keyboard: '' || [],                                             //命令监听的快捷键
    //     execute: ()=>{},                                                // 命令被执行时候的所做的内容
    //     followQueue: true,                                              // 命令执行完后，是否将该命令添加至命令队列
    // }
    setCommandState = function (data = {}) {
        commondState.commands[data.name] = function() {
            const {undo, redo} = data.execute();
            // 是否添加至命令队列
            if(data.followQueue) {
                commondState.queue.push({redo, undo})
                // 添加命令时，current自动+1
                commondState.current += 1;
            }
            redo();
        }
    }

    setCommandState({
        name: 'undo',           // 撤销命令
        keybord: 'ctrl+z',
        followQueue: false, // 只需要redo事件
        execute: function() {
            // 命令被执行时，要做的事情
            return {
                // 撤销命令只需要一个redo事件
                redo: function() {
                    let {current, queue} = commondState;
                    if(current === -1) return
                    const {undo} = queue[current];
                    undo && undo();
                    // 撤销命令时，current自动-1
                    commondState.current -= 1;
                },
            }
        }
    });

    setCommandState({
        name: 'redo',   //重做命令
        keyboard: [
            'ctrl+y',
            'ctrl+shift+z',
        ],
        followQueue: false,
        execute: function() {
            return {
                redo: function() {
                    let {current, queue} = commondState;
                    if(!queue[current]) return
                    const {redo} = queue[current];
                    redo && redo();
                    current +=1;
                }
            }
        }
    });

    return {
        commondState,
        setCommandState
    }
}

export default useCommander;