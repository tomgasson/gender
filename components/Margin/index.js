import React from 'react'

export default class Margin {
	static defaultProps = {
		top: 0,
		bottom: 30,
		left: 50,
		right: 50
	}
	renderChildren(){
		return React.Children.map(this.props.children, d => {
			let width = this.props.width - this.props.left - this.props.right
			let height = this.props.height - this.props.top - this.props.bottom
			return React.cloneElement(d, {width, height})
		})
	}
	render(){
		return <g transform={`translate(${this.props.left},${this.props.top})`}>{this.renderChildren()}</g>
	}
}