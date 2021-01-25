import React, { Component } from 'react'
import './style/index';

export default class VisualEditor extends Component {
    render() {
        return (
            <div className="visual-editor">
                <div className="visual-editor-menu">
                    visual-editor-menu
                </div>
                <div className="visual-editor-head">
                    visual-editor-head
                </div>
                <div className="visual-editor-operator">
                    visual-editor-operator
                </div>
                <div className="visual-editor-body">
                    <div className="visual-editor-content">
                        visual-editor-body
                    </div>
                </div>

            </div>
        )
    }
}