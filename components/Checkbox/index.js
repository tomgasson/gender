import styles from './index.css'
import React from 'react'
import classnames from 'classnames'
import fa from 'font-awesome/css/font-awesome.css'
export default class Checkbox {
	render(){
		let cls = {}
		cls[fa.fa] = true
		cls[fa['fa-check-square-o']] = this.props.checked
		cls[fa['fa-square-o']] = !this.props.checked
		return <div className={styles.checkbox} onClick={this.props.toggle}>Color by industry division <i className={classnames(cls)} /></div>
	}
}