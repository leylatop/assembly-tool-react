import React, { Component } from 'react'
import './style'

export default class VisualEditorBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            block: this.props.block,
            config: this.props.config
        }
    }

    componentDidMount() {
        let {block} = this.state;
        let {adjustPosition} = block;
        // 添加组件时候，自动调整位置
        if(adjustPosition === true) {
            let {offsetWidth, offsetHeight} = this.refs.blockContainer;
            block.left =  block.left - offsetWidth / 2;
            block.top = block.top - offsetHeight / 2;
            block.adjustPosition = false;
        }

        this.setState({
            block
        })
    }
    
    render() {
        let {block, config} = this.state;
        const {top, left, componentKey, focus} = block;
        const {render} = config.componentMap[componentKey];
        const style  = {
            top: `${top}px`,
            left: `${left}px`
        }
        let isFocus = focus ? 'visual-editor-block-focus' : '';
        return (
            <div ref='blockContainer' className={`visual-editor-block ${isFocus}`} style={style}>
                {render()}
            </div>
        )
    }
}

VisualEditorBlock.defaultProps = {
    block: {
        top: 0,
        left: 0,
        componentKey: 'text',
        adjustPosition: true,       // 是否居中
        focus: false,               // 是否为选中状态
    },
    config: {
        componentMap: {}
    }
}

