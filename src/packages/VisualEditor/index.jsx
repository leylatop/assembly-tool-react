import React, { Component } from 'react'
import {Button, Input  } from 'antd';
import VisualEditorBlock from '../VisualEditorBlock';

import 'antd/dist/antd.css';
import './style/index';

import createVisualEditorConfig from '../utils/createVisualEditorConfig.js'
const VisualConfig = createVisualEditorConfig();

const {componentList, componentMap, registry} = VisualConfig;

registry('text', {
    lable: '文本',
    preview: () => '预览文本',
    render: ()=> '渲染文本',
});
registry('button', {
    lable: '按钮',
    preview: () => {return <Button>按钮</Button>},
    render: ()=> {return <Button>渲染按钮</Button>},
})
registry('input', {
    lable: '输入框',
    preview: () => {return <Input value="输入框" />},
    render: ()=> {return <Input value="输入框" />},
});
let menuDragger = {};


export default class VisualEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: null,
            container: {
                width: 800,
                height: 500,
            },
            blocks: [],
        }
        this.containerRef = null;
        this.dragstart = this.dragstart.bind(this);
        this.dragenter = this.dragenter.bind(this)
        this.dragover = this.dragover.bind(this)
        this.dragleave = this.dragleave.bind(this)
        this.dragend = this.dragend.bind(this)
        this.drop = this.drop.bind(this)
    }
    
    componentDidMount() {
        
        this.containerRef = this.refs.container;
        // this.containerRef = document.getElementsByClassName('visual-editor-container')[0];
    }
    dragstart(event, component) {
        const {dragenter,dragover, dragleave, containerRef, drop} = this;
        containerRef.addEventListener('dragenter', dragenter);
        containerRef.addEventListener('dragover', dragover);
        containerRef.addEventListener('dragleave', dragleave);
        containerRef.addEventListener('drop', drop);

        this.setState({
            currentComponent: component
        })
    }
    dragenter(event) {
        event.dataTransfer.dropEffect = 'move';
    }
    dragover(event) {
        event.preventDefault();
        
    }
    dragleave(event, component) {
        event.dataTransfer.dropEffect = 'none';
    }
    dragend() {
        const {dragenter,dragover, dragleave, containerRef, drop} = this;
        containerRef.removeEventListener('dragenter', dragenter);
        containerRef.removeEventListener('dragover', dragover);
        containerRef.removeEventListener('dragleave', dragleave);
        containerRef.removeEventListener('drop', drop);
        this.setState({
            currentComponent: null
        })
    }
    drop(event, component) {
        let {currentComponent} = this.state;
        console.log(currentComponent);
        const {blocks} = this.state || [];
        blocks.push ({
            ...currentComponent,
            top: event.offsetY,
            left: event.offsetX
        })
        this.setState({blocks});
    }


    render() {
        let {blocks, container} = this.state;
        let {width, height} = container;
        
        const {dragstart, dragenter, dragleave, dragend, drop} = this;
        return (
            <div className="visual-editor">
                <div className="visual-editor-menu">
                    {
                        componentList.map((item, index) => {
                            return (
                                <div key={index} className="visual-editor-menu-item"
                                draggable
                                onDragEnd={dragend}
                                onDragStart={(e)=> {dragstart(e, item)}}>
                                    <span className="visual-editor-menu-item-lable">{item.lable}</span>
                                    <div className="visual-editor-menu-item-content">
                                        {
                                            item.preview()
                                        }
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
                        <div ref="container" className="visual-editor-container" style={{width, height}}>
                        {
                            blocks.map((item, index)=> {
                                return <VisualEditorBlock key={index} item={item}/>
                            })
                        }
                        hello
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
    
}