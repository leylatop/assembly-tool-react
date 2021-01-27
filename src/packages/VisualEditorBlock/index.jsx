import React, { Component } from 'react'
import './style'

export default class VisualEditorBlock extends Component {
    
    render() {
        let {block, config} = this.props;
        const {top, left, componentKey} = block;
        const {render} = config.componentMap[componentKey];
        const style  = {
            top: `${top}px`,
            left: `${left}px`
        }
        return (
            <div className="visual-editor-block" style={style}>
                {render()}
            </div>
        )
    }
}

VisualEditorBlock.defaultProps = {
    block: {
        top: 0,
        left: 0,
        componentKey: 'text'
    },
    config: {
        componentMap: {}
    }
}

