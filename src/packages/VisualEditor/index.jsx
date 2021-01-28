import React, { Component } from 'react'
import {Button, Input  } from 'antd';
import VisualEditorBlock from '../VisualEditorBlock';

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

export default class VisualEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            container: this.props.container,
            blocks: this.props.blocks,
        }
        this.blockHandler = {};
        this.containerRef = null;
        this.menuDragger = this.menuDragger.bind(this);
        this.focusHandler = this.focusHandler.bind(this);
        this.clearFocus = this.clearFocus.bind(this)
    }
    
    componentDidMount() {
        this.blockHandler= this.menuDragger();

    }

    clearFocus(block) {
        let {blocks} = this.state;
        if(blocks.leng === 0) return
        if(!!block) {
            blocks.forEach((item) => {
                if(item !== block) {
                    item.focus = false;
                }
            });
        }
        this.setState({blocks})  
    }

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

    focusHandler() {
        const container = {
            onMouseDown: (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.clearFocus();
            }
        };
        const block = {
            onMouseDown: (event, block) => {
                event.stopPropagation();
                event.preventDefault();
                // 如果按住了shiftkey，则要选中多个block
                if(event.shiftKey) {
                    block.focus = !block.focus;
                    this.forceUpdate();
                } 
                // 否则除了当前block，其他的都设置为未选中的状态
                else {
                    block.focus = true;
                    this.clearFocus(block);
                }
            }
        }
        return {
            container, block
        }
    }

    render() {
        let {blocks, container} = this.state;
        let {width, height} = container;
        let { focusHandler} = this;
        console.log('object')
        return (
            <div className="visual-editor">
                <div className="visual-editor-menu">
                    {
                        componentList.map((item, index) => {
                            return (
                                <div key={index} className="visual-editor-menu-item"
                                    draggable
                                    onDragEnd={()=> {this.blockHandler.dragend()}}
                                    onDragStart={(e)=> {this.blockHandler.dragstart(e, item)}}>
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
                    visual-editor-head
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