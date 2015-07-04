import styles from './index.css'
import React from 'react'
import fa from 'font-awesome/css/font-awesome.css'
import classnames from 'classnames'
import d3 from 'd3'
let format = d3.format(',')
export default class Tooltip {
	renderDivision(){
		if (!this.props.division){
			return null
		}
		return <div className={styles.division}>{this.props.division}</div>
	}
	render(){
		let male = {}
		male[fa.fa] = true
		male[fa['fa-male']] = true
		male[styles.maleicon] = true
		let female = {}
		female[fa.fa] = true
		female[fa['fa-female']] = true
		female[styles.femaleicon] = true

		return (
			<div className={styles.tooltip}>
				<div className={styles.name}>{this.props.name}</div>
				{this.renderDivision()}
				<div className={styles.numbers}>
					<div className={styles.male}><i className={classnames(male)} />{format(this.props.male)}</div>
					<div className={styles.female}>{format(this.props.female)}<i className={classnames(female)} /></div>
				</div>
			</div>
		)
	}
}
