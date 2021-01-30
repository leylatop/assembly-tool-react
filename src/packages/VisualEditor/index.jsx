import React, { Component } from 'react'
import {Button, Input  } from 'antd';
import VisualEditorBlock from '../VisualEditorBlock';
import useVisualCommand from '../utils/commandQueueHandler';

import 'antd/dist/antd.css';
import './style/index';

import createVisualEditorConfig from '../utils/createVisualEditorConfig.js';
import createNewBlock from '../utils/createNewBlock.js';
const VisualConfig = createVisualEditorConfig();

const {componentList, componentMap, registry} = VisualConfig;

registry('text', {
    key: 'text',
    lable: '文本',
    preview: () => '预览文本',
    render: ()=> '渲染文本',
});
registry('button', {
    key: 'button',
    lable: '按钮',
    preview: () => {return <Button>按钮</Button>},
    render: ()=> {return <Button>渲染按钮</Button>},
})
registry('input', {
    key: 'input',
    lable: '输入框',
    preview: () => {return <Input value="输入框" />},
    render: ()=> {return <Input value="输入框" />},
});
function EditorHeader() {
    const commander = useVisualCommand();
    const buttons = [
        {label: '撤销', icon: 'icon-back', hander: commander.undo, tip: 'ctrl+z'},
        {label: '重做', icon: 'icon-forward', hander: commander.redo, tip: 'ctrl+y, ctrl+shift+z'},
        {label: '删除', icon: 'icon-delete', hander: ()=>commander.delete(), tip: 'ctrl+d, backspace, delete'},
    ];
    return <React.StrictMode>
        {
            buttons.map((btn, index)=> {
                return (
                    <div className="visual-editor-head-button" key={index} onClick={btn.hander}>{btn.label}</div>
                )
            })
        }
    </React.StrictMode>
}

export default class VisualEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            container: this.props.container,
            blocks: this.props.blocks,
        }
        this.menuBlockHandler = {};
        this.containerRef = null;
        this.menuDragger = this.menuDragger.bind(this);
        this.focusHandler = this.focusHandler.bind(this);
        this.clearFocus = this.clearFocus.bind(this);
        this.containerDragger = this.containerDragger.bind(this)
    }
    
    componentDidMount() {
        this.menuBlockHandler= this.menuDragger();
    }

    // 清空选中状态
    clearFocus(block) {
        let {blocks} = this.state;
        if(blocks.leng === 0) return

        if(!!block) {
            blocks.forEach((item) => {
                if(item !== block) {
                    item.focus = false;
                }
            });
        } else {
            blocks.forEach((item) => {item.focus = false;});
        }
        this.setState({blocks})
    }

    // 记录选中和未选中的block数据
    focusData() {
        // 选中block
        let focus = [];
        // 未选中block
        let unFocus = [];

        let {blocks} = this.state;

        blocks.forEach((item) => {
            if(item.focus) focus.push(item)
            else unFocus.push(item)
        })
        return {
            focus,
            unFocus
        }
    }

    // 左侧组件列表拖拽事件
    menuDragger() {
        let currentComponent = null;
        const {containerRef} = this;
        const blockHandler = {
            dragstart: (event, component)=>{
                const {dragenter,dragover, dragleave, drop} = containerHandler;
                containerRef.addEventListener('dragenter', dragenter);
                containerRef.addEventListener('dragover', dragover);
                containerRef.addEventListener('dragleave', dragleave);
                containerRef.addEventListener('drop', drop);
                currentComponent = component;
            },
            dragend: ()=> {
                const {dragenter,dragover, dragleave, drop} = containerHandler;
                containerRef.removeEventListener('dragenter', dragenter);
                containerRef.removeEventListener('dragover', dragover);
                containerRef.removeEventListener('dragleave', dragleave);
                containerRef.removeEventListener('drop', drop);
                currentComponent = null;
            }
        };

        const containerHandler = {
            // 鼠标进入容器后，设置鼠标为可放置状态
            dragenter:(event)=> {
                event.dataTransfer.dropEffect = 'move';
            },
            // 鼠标在容器中移动的时候，禁用默认事件
            dragover:(event)=> {
                event.preventDefault();
            },
            // 鼠标在拖拽过程中如果离开了容器，设置鼠标为不可放置状态
            dragleave:(event)=> {
                event.dataTransfer.dropEffect = 'none';
            },
            // 放置的时候，通过事件对象的offsetX offsetY添加一条数据
            drop:(event)=> {
                const {blocks} = this.state || [];
                blocks.push (createNewBlock({
                    top: event.offsetY,
                    left: event.offsetX,
                    component: currentComponent
                }))
                this.setState({blocks});
            }
        }

        return blockHandler;
    }

    // 容器内选中事件
    focusHandler() {
        const container = {
            onMouseDown: (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.clearFocus();
            }
        };
        let focusData= this.focusData();
        const block = {
            onMouseDown: (event, block) => {
                event.stopPropagation();
                event.preventDefault();
                // 当前未选中，点击后选中，若没按住shift键，则清楚其他block的选中状态
                console.log('block.focus', block.focus);
                console.log('event.shiftKey', event.shiftKey);
                // 如果按住了shiftkey，则要选中多个block
                if(event.shiftKey) {
                    // 此时没有选中的，则选中；若此时有选中的，则改变block的状态
                    if(focusData.focus.leng <=1) {
                        block.focus = true;
                    } else {
                        block.focus = !block.focus;
                    }
                    this.forceUpdate();
                } 
                // 否则除了当前block，其他的都设置为未选中的状态
                else {
                    // 如果该block没有被选中，才清空其他选中的
                    // 否则不做任何不做任何事情，防止拖拽多个block，取消其他block的选中状态
                    if(!block.focus) {
                        block.focus = true;
                        this.clearFocus(block);
                    }
                }
                this.containerDragger().mouseDown(event);
                
            }
        }
        return {
            container, block
        }
    }

    // container内拖拽事件
    containerDragger() {
        let dragState = {
            startX: 0,
            startY: 0,
            startPos: [],
        };
        let focusData= this.focusData();
        const mouseDown = (event)=> {
            dragState.startX= event.clientX;
            dragState.startY = event.clientY;
            dragState.startPos = focusData.focus.map(({top, left})=> {return {top, left}})
            console.log(dragState)
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }
        const mouseMove = (event)=>  {
            const durX = event.clientX - dragState.startX;
            const durY = event.clientY - dragState.startY;
            focusData.focus.map((block, index) => {
                block.top = dragState.startPos[index].top + durY;
                block.left = dragState.startPos[index].left + durX
            });
            this.forceUpdate();
        }
        const mouseUp = ()=> {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            dragState.startX= 0;
            dragState.startY = 0;
        }
        return {
            mouseDown
        }
    }

    render() {
        let {blocks, container} = this.state;
        let {width, height} = container;
        let { focusHandler} = this;
        
        return (
            <div className="visual-editor">
                <div className="visual-editor-menu">
                    {
                        componentList.map((item, index) => {
                            return (
                                <div key={index} className="visual-editor-menu-item"
                                    draggable
                                    onDragEnd={()=> {this.menuBlockHandler.dragend()}}
                                    onDragStart={(e)=> {this.menuBlockHandler.dragstart(e, item)}}>
                                    <span className="visual-editor-menu-item-lable">{item.lable}</span>
                                    <div className="visual-editor-menu-item-content">
                                    {item.preview()}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="visual-editor-head">
                <EditorHeader />
                </div>
                <div className="visual-editor-operator">
                    visual-editor-operator
                </div>
                <div className="visual-editor-body">
                    <div className="visual-editor-content">
                        <div ref={(ref) => this.containerRef = ref} className="visual-editor-container" style={{width, height}} onMouseDown={focusHandler().container.onMouseDown}>
                        {
                            blocks.map((item, index)=> {
                                return <VisualEditorBlock key={index} block={item} config={{componentMap}} onMouseDownBlock={focusHandler().block.onMouseDown}/>
                            })
                        }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

VisualEditor.defaultProps = {
    container: {
        width: 800,
        height: 500,
    },
    blocks: [
        {
            top: 0,
            left: 0,
            componentKey: 'text',
            focus: false,
        },
        {
            top: 100,
            left: 100,
            componentKey: 'button',
            focus: false,

        },
        {
            top: 300,
            left: 200,
            componentKey: 'input',
            focus: true
        },
    ]
    
}