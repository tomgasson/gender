import React from 'react'
import styles from './index.css'
import classnames from 'classnames'

export default class Toggle {
	select(d){
		this.props.select(d)
	}
	reset(){
		this.props.select()
	}
	render(){
		let all
		if (this.props.all){
			all = <Button active={!this.props.selected} name="ALL" onClick={this.reset.bind(this)} />
		}
		return (
			<div className={styles.toggles} >
				{all}
				{this.props.items.map(d => <Button key={d} active={d==this.props.selected} onClick={this.select.bind(this,d)} name={d} />)}
			</div>
		)
	}
}

class Button {
	render(){
		let cls = {}
		cls[styles.button] = true
		cls[styles.active] = this.props.active

		return <div onClick={this.props.onClick} className={classnames(cls)}>{this.props.name}</div>
	}
}