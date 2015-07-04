import React from 'react'
import styles from './index.css'
export default class SVG extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			width: 400,
			height: 100
		}
		this.update = this.update.bind(this)
	}
	componentDidMount(){
		window.addEventListener('resize', this.update)
		this.update()
	}
	componentDidUpdate(){
		this.update()
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.update)
	}
	update(){
		let {width, height} = React.findDOMNode(this).getBoundingClientRect()
		if (this.state.width !== width || this.state.height !== height) {
			this.setState({width, height})
		}
	}
	render(){
		return <svg className={styles.svg} width={this.state.width} height={this.state.height} >{React.Children.map(this.props.children, d => React.cloneElement(d, {...this.state, ...this.props}))}</svg>
	}
}