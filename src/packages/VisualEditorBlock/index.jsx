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
        const {top, left, componentKey} = block;
        const {render} = config.componentMap[componentKey];
        const style  = {
            top: `${top}px`,
            left: `${left}px`
        }
        return (
            <div ref='blockContainer' className="visual-editor-block" style={style}>
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
        adjustPosition: true
    },
    config: {
        componentMap: {}
    }
}

