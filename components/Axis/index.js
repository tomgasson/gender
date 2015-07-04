import React from 'react'
import styles from './index.css'
export default class Axis {
	componentDidMount(){
		this.update()
	}
	componentDidUpdate(){
		this.update()
	}
	update(){
		let scale = d3.scale.linear()
			.range([0, this.props.width])
		let axis = d3.svg.axis()
			.scale(scale)
			.orient('bottom')
			.ticks(4)
			.tickValues([0,0.5,1])
			.tickFormat(d => {
				d * 100 + '%'
				if (d < 0.05){
					return "Male dominated"
				} else if (d > 0.95){
					return "Female dominated"
				} else if (d === 0.5){
					return "Balanced"
				} else if (d > 0.5){
					return 'More female'
				} else {
					return 'More male'
				}
			})

		let el = d3.select(React.findDOMNode(this))
			.call(axis)
	}
	render(){
		return <g className={styles.axis} transform={`translate(0,${this.props.height})`}></g>
	}
}