import React, { Component } from 'react'
import './style'

export default class VisualEditorBlock extends Component {
    
    render() {
        const {top, left, lable, preview, render,} = this.props.item;
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
    item: {top: 0,
    left: 0,}

}

